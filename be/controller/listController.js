//!-- backend/controller/listController.js -->

const List = require('../models/listModel');

// Erstellen einer neuen Liste
exports.createList = async (req, res) => {
    try {
        const { user_id } = req.body;
        const list = await List.create({ user_id });
        res.status(201).json(list);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Erstellen der Liste.' });
    }
};

// Abrufen aller Listen
exports.getLists = async (req, res) => {
    try {
        const lists = await List.findAll();
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Listen.' });
    }
};

// Abrufen einer Liste nach ID
exports.getListById = async (req, res) => {
    try {
        const list = await List.findByPk(req.params.id);
        if (list) {
            res.status(200).json(list);
        } else {
            res.status(404).json({ error: 'Liste nicht gefunden.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Liste.' });
    }
};

// Aktualisieren einer Liste
exports.updateList = async (req, res) => {
    try {
        const { user_id } = req.body;
        const [updated] = await List.update({ user_id }, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedList = await List.findByPk(req.params.id);
            res.status(200).json(updatedList);
        } else {
            res.status(404).json({ error: 'Liste nicht gefunden.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Aktualisieren der Liste.' });
    }
};

// Löschen einer Liste
exports.deleteList = async (req, res) => {
    try {
        const deleted = await List.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).json({ message: 'Liste erfolgreich gelöscht.' });
        } else {
            res.status(404).json({ error: 'Liste nicht gefunden.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Löschen der Liste.' });
    }
};
