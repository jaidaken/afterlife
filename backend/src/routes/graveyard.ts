import express from 'express';
import Graveyard from '../models/Graveyard';

const router = express.Router();

router.post('/graveyard', async (req, res) => {
  try {
    const graveyardEntry = new Graveyard(req.body);
    await graveyardEntry.save();
    res.status(201).json(graveyardEntry);
  } catch (error) {
    console.error('Error creating graveyard entry:', error);
    res.status(500).json({ message: 'Error creating graveyard entry', error });
  }
});

// GET endpoint to retrieve all graveyard entries
router.get('/graveyard', async (req, res) => {
  try {
    const graveyardEntries = await Graveyard.find();
    res.status(200).json(graveyardEntries);
  } catch (error) {
    console.error('Error fetching graveyard entries:', error);
    res.status(500).json({ message: 'Error fetching graveyard entries', error });
  }
});

// GET endpoint to retrieve a specific graveyard entry by character name
router.get('/graveyard/:charName', async (req, res) => {
  try {
    const { charName } = req.params;
    const graveyardEntry = await Graveyard.findOne({ charName });
    if (!graveyardEntry) {
      return res.status(404).json({ message: 'Graveyard entry not found' });
    }
    res.status(200).json(graveyardEntry);
  } catch (error) {
    console.error('Error fetching graveyard entry:', error);
    res.status(500).json({ message: 'Error fetching graveyard entry', error });
  }
});

export default router;
