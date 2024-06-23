import express from 'express';
import User from '../models/userModel.js';
import { generateAccessToken } from '../auth.js';

const router = express.Router();

// Registrierung eines neuen Benutzers
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Name, Email, and Password are required' });
  }

  try {
    const user = await User.create({ user_name: username, email, password_hash: password });
    const token = generateAccessToken(user.id);
    res.status(201).json({ token });
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
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

export default router;
