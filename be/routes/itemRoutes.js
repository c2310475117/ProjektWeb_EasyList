//!-- backend/routes/itemRoutes.js -->

import express from 'express';
import Item from '../models/itemModel.js';
import { getIconDatafromAPI } from '../controller/IconApi.js';

const router = express.Router();

// Erstellen eines neuen Items
router.post('/', async (req, res) => {
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
  
      // Erfolgreiche Antwort mit dem erstellten Item zurückgeben
      res.status(201).json(newItem);
    } catch (error) {
      console.error('Fehler beim Verarbeiten des Keywords und Icons:', error);
      res.status(500).send('Interner Serverfehler');
    }
  });;
  

// Route zum Abrufen aller Items
router.get('/', async (req, res) => {
    try {
        // Alle Items aus der Datenbank abrufen
        const items = await Item.findAll();

        // Überprüfen, ob Items gefunden wurden
        if (items.length > 0) {
            // Wenn Items gefunden wurden, sende sie als JSON zurück
            res.status(200).json(items);
        } else {
            // Wenn keine Items gefunden wurden, sende eine entsprechende Fehlermeldung zurück
            res.status(404).json({ error: 'Keine Items gefunden.' });
        }
    } catch (error) {
        // Im Falle eines Fehlers beim Abrufen der Items sende eine entsprechende Fehlermeldung zurück
        console.error('Fehler beim Abrufen der Items:', error);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});

// Abrufen eines Items nach ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(404).json({ error: 'Item nicht gefunden.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen des Items.' });
    }
});

// Aktualisieren eines Items
router.put('/:id', async (req, res) => {
    try {
        const { icon } = req.body;
        const [updated] = await Item.update({ icon }, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedItem = await Item.findByPk(req.params.id);
            res.status(200).json(updatedItem);
        } else {
            res.status(404).json({ error: 'Item nicht gefunden.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Aktualisieren des Items.' });
    }
});

// Löschen eines Items
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Item.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).json({ message: 'Item erfolgreich gelöscht.' });
        } else {
            res.status(404).json({ error: 'Item nicht gefunden.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Löschen des Items.' });
    }
});

export default router;
