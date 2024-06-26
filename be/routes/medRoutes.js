import express from 'express';
import Med from '../models/medModel.js';
import { authMiddleware } from '../auth.js';

const router = express.Router();

// Hinzufügen eines Meds
router.post('/user/lists/:listId/meds', authMiddleware, async (req, res) => {
  const { keyword, userId } = req.body;
  const { listId } = req.params;

  if (!keyword || !listId) {
    return res.status(400).send('Keyword and listId are required');
  }

  try {
    const newMed = await Med.create({ m_list_id: listId, med_title_en: keyword, userId });
    res.status(201).json(newMed);
  } catch (error) {
    console.error('Fehler beim Erstellen des Meds:', error);
    res.status(500).send('Interner Serverfehler');
  }
});

// Abrufen der Meds einer Liste
router.get('/user/lists/:listId/meds', authMiddleware, async (req, res) => {
  try {
    const { listId } = req.params;
    const meds = await Med.findAll({ where: { m_list_id: listId } });
    res.status(200).json(meds);
  } catch (error) {
    console.error('Fehler beim Abrufen der Meds:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Löschen eines Meds
router.delete('/user/lists/:listId/meds/:medId', authMiddleware, async (req, res) => {
  try {
    const { medId } = req.params;
    await Med.destroy({ where: { med_id: medId } });
    res.status(204).json({ message: 'Med erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Meds:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

export default router;
