// backend/src/routes/characters.ts
import express from 'express';
import { getAllCharacters, getCharacterByName } from '../utils/csvReader';

const router = express.Router();

router.get('/characters', async (req, res) => {
  try {
    const characters = await getAllCharacters();
    res.json(characters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching characters', error });
  }
});

router.get('/characters/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const character = await getCharacterByName(name);
    if (character) {
      res.json(character);
    } else {
      res.status(404).json({ message: 'Character not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching character', error });
  }
});

export { router as characterRouter };
