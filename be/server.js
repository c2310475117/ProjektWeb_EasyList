//!-- backend/server.js -->


import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';

import { getIconDatafromAPI } from './controller/api.js';
import Sequ from './db.js';
import Item from './models/itemModel.js';

const app = express();

Sequ.sync().then(() => console.log('Datenbank ist bereit')).catch(err => console.error('Fehler beim Synchronisieren der Datenbank:', err));

app.use(cors());
app.use(bodyParser.json());
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, '../fe')));

app.post('/api/keyword', async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) {
    return res.status(400).send('Keyword is required');
  }
  console.log('Empfangenes Keyword:', keyword);

  try {
    const iconData = await getIconDatafromAPI(keyword);
    if (!iconData) {
      return res.status(500).send('Icon konnte nicht abgerufen werden');
    }
    console.log('Erhaltene Icon-Daten:', iconData);

    const newItem = await Item.create({ icon: iconData, title_en: keyword, title_de: keyword });
    console.log('Erstelltes Item:', newItem);

    res.status(200).send('Keyword und Icon erfolgreich verarbeitet');
  } catch (error) {
    console.error('Fehler beim Verarbeiten des Keywords und Icons:', error);
    res.status(500).send('Interner Serverfehler');
  }
});

app.get('/api/message', (req, res) => {
  res.json({ message: 'HELLO!' });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});