//!-- backend/controller/itemController.js -->

const Item = require('../models/itemModel');

// Erstellen eines neuen Items
exports.createItem = async (req, res) => {
    try {
        const { list_id, icon } = req.body;
        const item = await Item.create({ list_id, icon });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Erstellen des Items.' });
    }
};

// Abrufen aller Items
exports.getItems = async (req, res) => {
    try {
        const items = await Item.findAll();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Items.' });
    }
};

// Abrufen eines Items nach ID
exports.getItemById = async (req, res) => {
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
};

// Aktualisieren eines Items
exports.updateItem = async (req, res) => {
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
};

// Löschen eines Items
exports.deleteItem = async (req, res) => {
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
};
