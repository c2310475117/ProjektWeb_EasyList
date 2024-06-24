// backend/auth.js

import User from './models/userModel.js';
import jwt from 'jsonwebtoken';
import List from './models/listModel.js';
import { Op } from 'sequelize';

const secretKey = 'geheimnis'; // Ersetzen Sie dies durch einen sichereren Schlüssel in einer Umgebungsvariablen

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

// Middleware zur Überprüfung des Tokens
export const authMiddleware = (req, res, next) => {
  // Überprüfung und Extraktion des Tokens aus dem Header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  try {
    // Überprüfung des Tokens und Extraktion der Nutzerdaten
    const decoded = verifyToken(token);
    req.user = decoded; // Speichern der Nutzerdaten im Request-Objekt
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(403).json({ message: 'Unauthorized access' });
  }
}

const checkListAccess = async (req, res, next) => {
  try {

    const listName = req.params.list_name; // Listennamen aus den Request-Parametern extrahieren
    const userId = req.user.user_id; // ID des authentifizierten Benutzers aus req.user e

    console.log("UserID:", userId);
    console.log("ListID:", listName);

    // Überprüfen, ob der Benutzer Zugriff auf die Liste hat
    const list = await List.findOne({ where: { list_name: listName, user_id: userId } }); // Annahme: List-Modell mit findOne

    if (!list) {
      return res.status(403).json({ message: 'Keine Berechtigung für die angeforderte Aktion.' });
    }

    req.list = list; // Füge die Liste dem Request hinzu
    next();
  } catch (error) {
    console.error('Autorisierungsfehler:', error);
    return res.status(500).json({ message: 'Interner Serverfehler.' });
  }
};

export { authMiddleware, generateAccessToken, checkListAccess, verifyToken };
