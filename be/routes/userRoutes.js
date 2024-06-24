// backend/routes/userRoutes.js

import express from 'express';
import User from '../models/userModel.js';
import List from '../models/listModel.js'
import bcrypt from 'bcrypt';
import { generateAccessToken, checkListAccess, verifyToken } from '../auth.js';
import { Op } from 'sequelize';
import { controllerRoutes } from './controllerRoutes.js';

const router = express.Router();

const createList = async (userId) => {
  try {
    const newList = await List.create({
      list_name: 'Default List', 
      l_user_id: userId,
    });
    return newList;
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
};

router.post('/lists', checkListAccess);

router.get('/lists/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const lists = await getUserLists(userId);
    res.status(200).json({ lists });
  } catch (error) {
    console.error('Fehler beim Abrufen der Listen des Benutzers:', error);
    res.status(500).json({ error: 'Interner Serverfehler beim Abrufen der Listen' });
  }
});

const getUserLists = async (req, res) => {
  const userId = req.params.userId; // Benutzer-ID aus der URL-Parameter

  try {
      // Suche nach Benutzer anhand der ID
      const user = await User.findByPk(userId);
      if (!user) {
          return res.status(404).json({ error: 'Benutzer nicht gefunden' });
      }

      // Suche nach Listen des Benutzers
      const userLists = await List.findAll({ where: { l_user_id: userId } });

      res.status(200).json({ lists: userLists });
  } catch (error) {
      console.error('Fehler bei getUserList:', error);
      res.status(500).json({ error: 'Interner Serverfehler' });
  }
};;

// Registrierung eines neuen Benutzers
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Request body:', req.body);


  if (!username || !email || !password) {
    console.log('Missing fields during registration');
    return res.status(400).json({ message: 'Name, Email, and Password are required' });
  }

  try {

    const existingUser = await User.findOne({ where: { [Op.or]: [{ user_name: username }, { email: email }] } });
if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
}

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Creating user:', { username, email });

    const user = await User.create({ user_name: username, email, password_hash: hashedPassword });

    const token = generateAccessToken(user.user_id);
    console.log('User created successfully:', user);

    const defaultList = await createList(user.user_id);
    console.log('Default list created for user:', defaultList);

    res.status(201).json({ token, user_id: user.user_id }); // Geändert: Senden von JSON-Antworten statt Redirect
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error', error: error.errors ? error.errors[0].message : error.message });
  }
});

// Anmeldung eines Benutzers
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and Password are required' });
  }

  try {
    const user = await User.findOne({ where: { user_name: username } });

    if (!user || user.password_hash !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateAccessToken(user.id);
    // Redirect to frontend index.html (or index.js) with token and user_id query parameters
    res.status(200).json({ token, user_id: user.id }); // Geändert: Senden von JSON-Antworten statt Redirect
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.delete('/:userId', verifyToken, async (req, res) => {
  const userIdToDelete = req.params.userId; // User ID to delete
  const requestingUserId = req.user.user_id; // User ID of requesting user

  try {
    // Check if the requesting user has permission to delete the user
    if (requestingUserId !== userIdToDelete) {
      return res.status(403).json({ message: 'Keine Berechtigung, um den Benutzer zu löschen' });
    }

    // Find the user to delete
    const deletedUser = await User.findByPk(userIdToDelete);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    // Delete user and related lists
    await List.destroy({ where: { l_user_id: userIdToDelete } });
    await deletedUser.destroy();

    res.status(200).json({ message: 'Benutzer erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Benutzers:', error);
    res.status(500).json({ error: 'Interner Serverfehler beim Löschen des Benutzers' });
  }
});

export default router;
