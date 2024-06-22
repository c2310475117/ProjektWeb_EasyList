// backend/server.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser'; 
import itemRoutes from './routes/itemRoutes.js';
import medRoutes from './routes/medRoutes.js';
import userRoutes from './routes/userRoutes.js';


import { controllerRoutes } from './routes/controllerRoutes.js'

import { authMiddleware, checkListAccess} from './auth.js'; 
import { syncDatabase } from './db.js'; 

const app = express();
const port = 3000;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());;


const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Statisches Verzeichnis
const frontendPath = path.join(__dirname, '../fe');
app.use(express.static(frontendPath));


// Routen nach der Datenbanksynchronisation definieren
syncDatabase().then(() => {
  // Debugging Ausgabe, um sicherzustellen, dass der Server gestartet ist
  console.log('Server gestartet. Weiterleitung zur Registrierungsseite.');

  // Weiterleitung zur Registrierungsseite, wenn die Wurzelroute aufgerufen wird
  app.get('/', (req, res) => {
    console.log('Anfrage zur Wurzelroute erhalten. Weiterleite zur Registrierungsseite.');
    res.sendFile(path.join(frontendPath, 'register.html')); // Sicherstellen, dass der Pfad korrekt ist
  });

  // Weitere Routen für Benutzer, Items und Medikamente
  controllerRoutes(); // Vor den Routen aufrufen
  app.use('/user', userRoutes);
  app.use('/items', authMiddleware, checkListAccess, itemRoutes);
  app.use('/med', authMiddleware, checkListAccess, medRoutes);

  // Test-Route
  app.get('/api/message', (req, res) => {
    res.json({ message: 'HELLO!' });
  });

  // Server starten
  app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
  });
});