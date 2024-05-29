//!-- backend/routes/userRoutes.js -->


import express from 'express';
import userController from '../controllers/userController.js'; // Stelle sicher, dass die Dateiendung ".js" angegeben ist

const router = express.Router();

// Route zum Erstellen eines neuen Benutzers
router.post('/users', userController.createUser);

// Route zum Abrufen aller Benutzer
router.get('/users', userController.getUsers);

export default router;