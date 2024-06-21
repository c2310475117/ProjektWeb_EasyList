// backend/routes/userRoutes.js

import express from 'express';
import User from '../models/userModel.js';
import List from '../models/listModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateAccessToken, verifyToken } from '../auth.js';
import { Op } from 'sequelize';


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
        [Op.or]: [{ user_name: YourName }, { email: YourEmail }]
      }
    });

    if (existingUser) {
      return res.redirect('http://localhost:3001/login.html'); // Beispiel für Weiterleitung
    }

    // Passwort hashen und neuen Benutzer erstellen
    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = await User.create({
      user_name: YourName,
      email: YourEmail,
      password_hash: hashedPassword,
    });

    const newList = await createList(newUser.user_id, 'Default List');

    // Erfolgreiche Antwort zurückgeben
    res.status(201).json({ newUser, newList });
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
    const user = await User.findOne({ where: { user_name: YourName } });
    if (!user) {
      return res.status(404).json({ error: 'userRoutes : User not found' });
    }

    const passwordMatch = await bcrypt.compare(Password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

     // Erstellung eines JWTs mit Benutzer-ID und einem geheimen Schlüssel
     const token = generateAccessToken(user.user_id);

    // Erfolgreiche Antwort mit JWT zurückgeben
    /*res.json ({
      // 
    })
      */
    res.status(200).json({ token, user_id: user.user_id, });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route zum Abrufen der Listen eines Benutzers
router.get('/lists', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const lists = await getUserLists(userId);
    res.status(200).json({ lists });
  } catch (error) {
    console.error('Error fetching user lists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:userId', verifyToken, async (req, res) => {
  const userIdToDelete = req.params.userId; // Die Benutzer-ID, die gelöscht werden soll
  const requestingUserId = req.user.user_id; // Die Benutzer-ID des anfragenden Benutzers

  try {
    // Prüfen, ob der anfragende Benutzer die Berechtigung hat, den Benutzer zu löschen
    if (requestingUserId !== userIdToDelete) {
      return res.status(403).json({ message: 'Keine Berechtigung, um den Benutzer zu löschen' });
    }

    // Hier implementiere die Logik zum Löschen des Benutzers und aller zugehörigen Listen, etc.
    // Beispiel: Benutzer löschen
    const deletedUser = await User.findByPk(userIdToDelete);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    await deletedUser.destroy();

    // Zusätzliche Logik für das Löschen von Listen, falls benötigt
    // Beispiel: Löschen aller Listen des Benutzers
    await List.destroy({
      where: { user_id: userIdToDelete }
    });

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