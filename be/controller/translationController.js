//!-- backend/controller/translationController.js -->

const ListTranslation = require('../models/listTranslationModel');
const ItemTranslation = require('../models/itemTranslationModel');

// Erstellen einer neuen List-Übersetzung
exports.createListTranslation = async (req, res) => {
    try {
        const { list_id, language, title } = req.body;
        const listTranslation = await ListTranslation.create({ list_id, language, title });
        res.status(201).json(listTranslation);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Erstellen der List-Übersetzung.' });
    }
};

// Erstellen einer neuen Item-Übersetzung
exports.createItemTranslation = async (req, res) => {
    try {
        const { item_id, language, content } = req.body;
        const itemTranslation = await ItemTranslation.create({ item_id, language, content });
        res.status(201).json(itemTranslation);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Erstellen der Item-Übersetzung.' });
    }
};

// Weitere Methoden wie getTranslations, updateTranslation, deleteTranslation können hier hinzugefügt werden.
