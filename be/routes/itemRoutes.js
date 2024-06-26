import express from 'express';
import Item from '../models/itemModel.js';
import { authMiddleware } from '../auth.js';

const router = express.Router();

// Erstellen eines neuen Items
router.post('/user/lists/:listId/items', authMiddleware, async (req, res) => {
    const { keyword, userId } = req.body; 
    const { listId } = req.params;

    if (!keyword || !listId) {
        return res.status(400).send('Keyword and listId are required');
    }

    try {
        const newItem = await Item.create({ i_list_id: listId, item_title_en: keyword, item_title_de: keyword, userId });
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Fehler beim Erstellen des Items:', error);
        res.status(500).send('Interner Serverfehler');
    }
});

// Abrufen der Items einer Liste
router.get('/user/lists/:listId/items', authMiddleware, async (req, res) => {
    try {
        const { listId } = req.params;
        const items = await Item.findAll({ where: { i_list_id: listId } });
        res.status(200).json(items);
    } catch (error) {
        console.error('Fehler beim Abrufen der Items:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

// Löschen eines Items
router.delete('/user/lists/:listId/items/:itemId', authMiddleware, async (req, res) => {
    try {
        const { itemId } = req.params;
        await Item.destroy({ where: { item_id: itemId } });
        res.status(204).json({ message: 'Item erfolgreich gelöscht' });
    } catch (error) {
        console.error('Fehler beim Löschen des Items:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

export default router;
