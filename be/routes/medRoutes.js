// backend/routes/medRoutes.js

import express from 'express';
import Med from '../models/medModel.js';
import { getMedfromAPI, compareWithExistingMedications } from '../controller/MedApi.js';

const router = express.Router();

// Route zum Abrufen von Medikamenten aus der API und Speichern in der Datenbank
router.post('/med', async (req, res) => {
    const { keyword } = req.body;
    if (!keyword) {
        return res.status(400).send('Keyword is required');
    }
    console.log('Empfangenes Keyword:', keyword);

    try {
        const data = await getMedfromAPI(keyword);
        if (!data) {
          return res.status(500).send('Med konnte nicht abgerufen werden');
        }
        console.log('Erhaltene Med-Daten:', data);
    
        console.log('Extracted MedData:',data.id, data.title); // Loggen des extrahierten Medikaments

        // Neues Medikament in der Liste erstellen
        const newMed = await Med.create({ id: data.id, title: data.title }); // 'medId' für die Medikamenten-ID

        // Erfolgreiche Antwort mit dem erstellten Medikament zurückgeben
        res.status(201).json(newMed);
    } catch (error) {
        console.error('Fehler beim Abrufen der Medikamente oder beim Speichern in der Datenbank:', error);
        res.status(500).send('Interner Serverfehler');
    }
});

router.get('/med', async (req, res) => {
    try {
        const meds = await Med.findAll(); // Alle Medikamente abrufen
        res.status(200).json(meds);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Medikamente.' });
    }
});

router.get('/med/:id', async (req, res) => {
    try {
        const item = await Med.findByPk(req.params.id);
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(404).json({ error: 'Item nicht gefunden.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen des Items.' });
    }
});

router.get('/compare/:newMedId', async (req, res) => {
    try {
        // extrahiert die ID des neuen Medikaments aus den Routenparametern.
        const newMedId = req.params.newMedId;
        const comparisonResults = await compareWithExistingMedications(newMedId);
        res.status(200).json(comparisonResults);
    } catch (error) {
        console.error('Fehler beim Vergleich der Medikamente:', error);
        res.status(500).json({ error: 'Fehler beim Vergleich der Medikamente.' });
    }
});

router.delete('/med/:id', async (req, res) => {
    try {
        const deleted = await Med.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).json({ message: 'Mederfolgreich gelöscht.' });
        } else {
            res.status(404).json({ error: 'Med nicht gefunden.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Löschen des Med.' });
    }
});

export default router;