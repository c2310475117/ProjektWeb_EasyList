// backend/auth.js


import User from './models/userModel.js';
import jwt from 'jsonwebtoken';


const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, 'geheimnis', { expiresIn: '1h' }); // Geheimnis ist dein geheimer Schlüssel
};

const verifyToken = (token) => {
  return jwt.verify(token, 'geheimnis'); // Verifiziere das Token
};

// Middleware zur Überprüfung des Tokens
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // JWT im Authorization Header

    if (!token) {
      return res.status(401).json({ message: 'Authentifizierungs-Token fehlt.' });
    }

    const decoded = verifyToken(token); // Token verifizieren

    // Benutzer aus der Datenbank anhand der ID im Token abrufen und zum Request hinzufügen
    const user = await User.findByPk(decoded.userId); // Annahme: User-Modell mit findByPk

    if (!user) {
      return res.status(401).json({ message: 'Ungültiger Token.' });
    }

    req.user = user; // Füge den Benutzer dem Request hinzu
    next();
  } catch (error) {
    console.error('Authentifizierungsfehler:', error);
    return res.status(401).json({ message: 'Authentifizierung fehlgeschlagen.' });
  }
};

const checkListAccess = async (req, res, next) => {
    try {
      const listId = req.params.listId; // Annahme: Liste wird über ID übergeben
      const userId = req.user.id; // ID des authentifizierten Benutzers
  
      // Überprüfen, ob der Benutzer Zugriff auf die Liste hat
      const list = await List.findOne({ where: { id: listId, userId } }); // Annahme: List-Modell mit findOne
  
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
  

export { authMiddleware, generateAccessToken , checkListAccess};
