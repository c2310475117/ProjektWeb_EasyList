//!-- backend/routes/userRoutes.js -->


const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route zum Erstellen eines neuen Benutzers
router.post('/users', userController.createUser);

// Route zum Abrufen aller Benutzer
router.get('/users', userController.getUsers);

export default  router;