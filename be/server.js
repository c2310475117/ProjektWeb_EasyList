//!-- backend/server.js -->


import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';
import itemRoutes from './routes/itemRoutes.js';
import medRoutes from './routes/medRoutes.js'

import Sequ from './db.js';


const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

Sequ.sync().then(() => console.log('Datenbank ist bereit')).catch(err => console.error('Fehler beim Synchronisieren der Datenbank:', err));

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../fe')));


app.post('/items', (req, res) => {
  itemRoutes(req, res);
});

app.get('/items', (req, res) => {
  itemRoutes(req, res);
});

app.delete ('/items/:id', (req, res) => {
  itemRoutes(req, res);
});

app.post('/med', (req, res) => {
  medRoutes(req, res);
});

app.get('/med', (req, res) => {
  medRoutes(req, res);
});

app.get('/compare/:newMedId', (req, res) => {
  medRoutes(req, res);
});

app.delete ('/med/:id', (req, res) => {
  medRoutes(req, res);
});

app.get('/api/message', (req, res) => {
  res.json({ message: 'HELLO!' });
});


app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});