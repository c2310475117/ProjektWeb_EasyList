// backend/routes/userRoutes.js

import express from 'express';
import User from '../models/userModel.js';
import List from '../models/listModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateAccessToken, verifyToken } from '../auth.js';
import { Op } from 'sequelize';


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

const getUserLists = async (userId) => {
  try {
    const lists = await List.findAll({
      where: { l_user_id: userId }
    });
    return lists;
  } catch (error) {
    console.error('Fehler beim Abrufen der Listen des Benutzers:', error);
    throw error;
  }
};


router.post('/register', async (req, res) => {
  const { YourName, YourEmail, Password } = req.body;
  console.log('Request body:', req.body);
  if (!YourName || !YourEmail || !Password) {
    return res.status(400).send('Name, Email, and Password are required');
  }

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ user_name: YourName }, { email: YourEmail }]
      }
    });

    if (existingUser) {
      return res.redirect(`http://localhost:3001/register.html?token=${token}&user_id=${user.user_id}`);
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = await User.create({
      user_name: YourName,
      email: YourEmail,
      password_hash: hashedPassword,
    });

    const newList = await createList(newUser.user_id);

    res.redirect('http://localhost:3001/index.html');
  } catch (error) {
    console.error('Error saving user to database:', error);
    res.status(500).send('Internal userRoute-1 server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { YourName, Password } = req.body;
  if (!YourName || !Password) {
    return res.status(400).json({ error: 'Username and Password are required' });
  }

  try {
    const user = await User.findOne({ where: { user_name: YourName } });
    if (!user) {
      return res.status(404).json({ error: 'userRoutes : User not found' });
    }

    const passwordMatch = await bcrypt.compare(Password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = generateAccessToken(user.user_id);
    // Redirect to frontend index.html (or index.js) with token and user_id query parameters
    res.redirect(`http://localhost:3001/register.html?token=${token}&user_id=${user.user_id}`);

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a user and their lists
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

  /*
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
*/



export default router;  