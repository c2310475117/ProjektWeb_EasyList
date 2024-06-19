//!-- backend/routes/itemRoutes.js -->

import express from 'express';
import Item from '../models/itemModel.js';
import List from '../models/listModel.js';
import User from '../models/userModel.js';

import { getIconDatafromAPI } from '../controller/IconApi.js';
import  { authMiddleware, generateAccessToken , checkListAccess} from '../auth.js'; 


const router = express.Router();

// Erstellen eines neuen Items
router.post('/', authMiddleware, async (req, res) => {
    const { keyword, userId } = req.body; // userId sollte vom Frontend gesendet werden
    if (!keyword || !userId) {
        return res.status(400).send('Keyword and userId are required');
    }
    console.log('Empfangenes Keyword und userId:', keyword, userId);

    try {
        // Finde die Liste des Benutzers
        const userLists = await List.findAll({ where: { user_id: userId } });
        if (!userLists || userLists.length === 0) {
            return res.status(404).send('Keine Liste für diesen Benutzer gefunden');
        }

        // Annahme: Wähle die erste Liste des Benutzers aus
        const userList = userLists[0];

        // Hier könntest du zusätzliches Logik einfügen, um zu überprüfen, ob der Benutzer Zugriff auf die Liste hat

        const iconData = await getIconDatafromAPI(keyword);
        if (!iconData) {
            return res.status(500).send('Icon konnte nicht abgerufen werden');
        }
        console.log('Erhaltene Icon-Daten:', iconData);

        const newItem = await Item.create({ list_id: userList.id, item_icon: iconData, item_title_en: keyword, item_title_de: keyword });

        // Erfolgreiche Antwort mit dem erstellten Item zurückgeben
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Fehler beim Verarbeiten des Keywords und Icons:', error);
        res.status(500).send('Interner itemRoute-1 Serverfehler');
    }
});

// Route zum Abrufen aller Items
router.get('/', authMiddleware, checkListAccess, async (req, res) => {
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
        res.status(500).json({ error: 'Interner itemRoute-2 Serverfehler.' });
    }
});

// Abrufen eines Items nach ID
router.get('/:id', authMiddleware, checkListAccess, async (req, res) => {
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
router.put('/:id', authMiddleware, checkListAccess, async (req, res) => {
    try {
        const { icon } = req.body;
        const [updated] = await Item.update({ icon }, {
            where: { item_id: req.params.id }
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
router.delete('/:id', authMiddleware, checkListAccess, async (req, res) => {
    try {
        const deleted = await Item.destroy({
            where: { item_id: req.params.id }
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
