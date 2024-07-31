import express from 'express';
import { getAllCharacters } from '../utils/csvReader';
import Character from '../models/Character';
import User from '../models/User';
import CharacterQueue from '../models/CharacterQueue';
import { encryptPassword } from '../utils/passwordUtils';

const router = express.Router();

router.post('/characters/import', async (req, res) => {
  try {
    const characters = await getAllCharacters();
    const savedCharacters = await Promise.all(
      characters.map(async (char) => {
        try {
          return await Character.findOneAndUpdate(
            { charName: char.charName },
            char,
            { new: true, upsert: true }
          );
        } catch (error) {
          console.error(`Error updating character ${char.charName}:`, error);
          return null;
        }
      })
    );
    res.json(savedCharacters.filter(char => char !== null));
  } catch (error) {
    res.status(500).json({ message: 'Error importing characters', error });
  }
});

router.post('/character-queue', async (req, res) => {
  const { charName, appearance, personality, alignment, discordId } = req.body;

  if (!charName || !appearance || !personality || !alignment || !discordId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newCharacter = new CharacterQueue({
      charName,
      appearance,
      personality,
      alignment,
      discordId,
    });

    const savedCharacter = await newCharacter.save();
    res.status(201).json(savedCharacter);
  } catch (error) {
    res.status(500).json({ message: 'Error adding character to queue', error });
  }
});

router.get('/character-queue', async (req, res) => {
  try {
    const characterQueue = await CharacterQueue.find();
    res.json(characterQueue);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching character queue', error });
  }
});

router.post('/accept-character/:discordId', async (req, res) => {
  const { discordId } = req.params;
  const { password } = req.body;

  try {
    const characterQueueItem = await CharacterQueue.findOne({ discordId });
    if (!characterQueueItem) {
      return res.status(404).json({ message: 'Character not found in queue' });
    }

    // Encrypt the password
    const encryptedPassword = await encryptPassword(password);

    const newCharacter = new Character({
      charName: characterQueueItem.charName,
      appearance: characterQueueItem.appearance,
      personality: characterQueueItem.personality,
      alignment: characterQueueItem.alignment,
      discordId: characterQueueItem.discordId,
      password: encryptedPassword,
    });

    await newCharacter.save();
    await CharacterQueue.findOneAndDelete({ discordId });

    res.status(201).json(newCharacter);
  } catch (error) {
    console.error('Error accepting character:', error);
    res.status(500).json({ message: 'Error accepting character', error });
  }
});

router.get('/characters', async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).send('Server error');
  }
});

router.get('/characters/user/:discordId', async (req, res) => {
  try {
    const { discordId } = req.params;
    const characters = await Character.find({ discordId });
    res.json(characters);
  } catch (error) {
    console.error('Error fetching user characters:', error);
    res.status(500).send('Server error');
  }
});


router.get('/characters/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const character = await Character.findOne({ charName: name });
    if (character) {
      res.json(character);
    } else {
      res.status(404).json({ message: 'Character not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching character', error });
  }
});

router.post('/characters/:charName/assign', async (req, res) => {
  const { charName } = req.params;
  const { discordId } = req.body;

  if (!charName || !discordId) {
    return res.status(400).json({ message: 'Character name and Discord ID are required' });
  }

  try {
    const character = await Character.findOne({ charName });
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    const user = await User.findOne({ discordId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.characters.push(character.charName);
    await user.save();

    console.log(`Assigned character ${charName} to user ${discordId}`);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning character', error });
  }
});

router.post('/characters', async (req, res) => {
  const { username, steamID, charName, profession, isAlive, zombieKills, survivorKills, hoursSurvived } = req.body;

  if (!charName) {
    return res.status(400).json({ message: 'Character name is required' });
  }

  try {
    const newCharacter = new Character({
      username,
      steamID,
      charName,
      profession,
      isAlive,
      zombieKills,
      survivorKills,
      hoursSurvived
    });

    const savedCharacter = await newCharacter.save();
    res.status(201).json(savedCharacter);
  } catch (error) {
    res.status(500).json({ message: 'Error adding character', error });
  }
});

export default router;
