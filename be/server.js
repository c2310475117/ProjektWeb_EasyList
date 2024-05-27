//!-- backend/server.js -->


import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';

import {getIconDatafromAPI} from './controller/api.js';

const app = express();
app.use(cors()); 
app.use(bodyParser.json());
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, '../fe')));

let storedIconData = ''; // Initialisiert storedIconData als leere Zeichenkette
// Simulierte Datenbank
// let database = [];


app.get('/api/icons', async (req, res) => {
    try {
      const svgData = await getIconDatafromAPI();
      storedIconData = svgData;
      res.json({ svg: storedIconData });
    } catch (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
      res.status(500).send('Interner Serverfehler');
    }
  });

  app.post('/api/icons', async (req, res) => {
    try {
      const keyword = req.body.keyword;
      if (!keyword) {
        return res.status(400).send('Keyword is required');
      }
      const sendIconData = await getIconDatafromAPI(keyword);
      res.json({ svg: sendIconData });
    } catch (error) {
      console.error('Fehler beim Verarbeiten der POST-Anfrage:', error);
      res.status(500).send('Interner Serverfehler');
    }
  });

// wenn im frontend '/api/message' aufgerufen wird ...
app.get('/api/message', (req, res) => {
    res.json({ message: 'HELLO!' });
});
  
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});