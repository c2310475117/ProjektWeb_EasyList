//!-- backend/controller/userController.js -->

const User = require('../models/userModel');

// Erstellen eines neuen Benutzers
exports.createUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = await User.create({ username, password_hash: hashPassword(password), email });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Erstellen des Benutzers.' });
    }
};

// Abrufen aller Benutzer
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Benutzer.' });
    }
};

// Hilfsfunktion zum Hashen des Passworts
const hashPassword = (password) => {
    // Implementiere die Passwort-Hashing-Logik hier
    return password; // Beispiel ohne tatsächliches Hashing
};