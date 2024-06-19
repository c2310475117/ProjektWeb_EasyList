// backend/routes/userRoutes.js

import express from 'express';
import User from '../models/userModel.js';
import List from '../models/listModel.js';
import bcrypt from 'bcrypt';
import {Op} from 'sequelize';
import jwt from 'jsonwebtoken';
import  { authMiddleware, generateAccessToken , checkListAccess} from '../auth.js'; 



const router = express.Router();

const createList = async (userId, listName) => {
  try {
    const newList = await List.create({
      user_id: userId,
      list_name: listName,
    });
    return newList;
  } catch (error) {
    console.error('Fehler beim Erstellen der Liste:', error);
    throw error;
  }
};

const getUserLists = async (userId) => {
  try {
    const lists = await List.findAll({
      where: { user_id: userId }
    });
    return lists;
  } catch (error) {
    console.error('Fehler beim Abrufen der Listen des Benutzers:', error);
    throw error;
  }
};

/// Beispiel: Registrierung eines neuen Benutzers
router.post('/register', async (req, res) => {
  const { YourName, YourEmail, Password } = req.body;
  console.log('Request body:', req.body);
  if (!YourName || !YourEmail || !Password) {
    return res.status(400).send('Name, Email, and Password are required');
  }

  try {
    // Überprüfen, ob Benutzer bereits existiert
    let existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: YourName }, { email: YourEmail }]
      }
    });

    if (existingUser) {
      return res.redirect('http://localhost:3001/login.html'); // Beispiel für Weiterleitung
    }

    // Passwort hashen und neuen Benutzer erstellen
    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = await User.create({
      username: YourName,
      email: YourEmail,
      password_hash: hashedPassword,
    });

    // Erfolgreiche Antwort zurückgeben
    res.status(201).json({ newUser });
  } catch (error) {
    console.error('Error saving user to database:', error);
    res.status(500).send('Internal userRoute-1 server error');
  }
});


// Beispiel: Authentifizierung und Ausstellung eines JWTs
router.post('/login', async (req, res) => {
  const { YourName, Password } = req.body;
  if (!YourName || !Password) {
    return res.status(400).json({ error: 'Username and Password are required' });
  }

  try {
    const user = await User.findOne({ where: { username: YourName } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(Password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Erstellung eines JWTs mit Benutzer-ID und einem geheimen Schlüssel
    const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

    // Erfolgreiche Antwort mit JWT zurückgeben
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal userRoute-2 server error' });
  }

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

});


export default router;