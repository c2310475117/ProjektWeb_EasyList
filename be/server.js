// backend/server.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser'; 
import itemRoutes from './routes/itemRoutes.js';
import medRoutes from './routes/medRoutes.js';
import userRoutes from './routes/userRoutes.js';

import { authMiddleware, generateAccessToken , checkListAccess} from './auth.js'; 
import { syncDatabase } from './db.js'; 

const app = express();
const port = 3000;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Statisches Verzeichnis
const frontendPath = path.join(__dirname, '../fe');
app.use(express.static(frontendPath));

// Route für die Standarddatei
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'register.html'));
});

// Synchronize the database
// Synchronize the database
syncDatabase().then(() => {
  // Einbinden der Routen
  app.use('/user', userRoutes);
  app.use('/items', authMiddleware, checkListAccess, itemRoutes);
  app.use('/med', authMiddleware, checkListAccess, medRoutes);

  // Test-Route
  app.get('/api/message', (req, res) => {
    res.json({ message: 'HELLO!' });
  });

  app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
  });
});