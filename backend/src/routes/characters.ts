import express from 'express';
import { getAllCharacters } from '../utils/csvReader';
import Character from '../models/Character';
import CharacterQueue from '../models/CharacterQueue';
import { encryptPassword } from '../utils/passwordUtils';
import { isAdmin, isApplicationTeam } from '../middleware/authMiddleware';
import RejectedCharacter from '../models/RejectedCharacter';
import Graveyard from '../models/Graveyard';

const router = express.Router();

//characters

router.post('/characters/import', isAdmin, async (req, res) => {
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
    const characterInDB = await Character.findOne({ charName: name });
    const characterInQueue = await CharacterQueue.findOne({ charName: name });

    if (characterInDB) {
      res.status(200).json(characterInDB);
    } else if (characterInQueue) {
      res.status(200).json(characterInQueue);
    } else {
      res.status(404).json({ message: 'Character not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching character', error });
  }
});

router.post('/characters', isApplicationTeam, async (req, res) => {
  const { username, steamID, charName, profession, isAlive, zombieKills, survivorKills, hoursSurvived } = req.body;

  if (!charName) {
    return res.status(400).json({ message: 'Character name is required' });
	}

	const existingCharacter = await Character.findOne({ charName });
  const graveyardCharacter = await Graveyard.findOne({ charName });

  if (existingCharacter || graveyardCharacter) {
    return res.status(409).json({ message: 'Character already exists' });
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

//character queue

router.post('/character-queue', isApplicationTeam, async (req, res) => {
  const { charName, discordId, age, birthplace, gender, appearance, personality, backstory, rejectionMessage } = req.body;

  if (!charName || !discordId || !age || !birthplace || !gender || !appearance || !personality || !backstory) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newCharacter = new CharacterQueue({
      charName,
      discordId,
      age,
      birthplace,
      gender,
      appearance,
      personality,
			backstory,
			rejectionMessage
    });

    const savedCharacter = await newCharacter.save();
    res.status(201).json(savedCharacter);
  } catch (error) {
    res.status(500).json({ message: 'Error adding character to queue', error });
  }
});

router.get('/character-queue', isApplicationTeam, async (req, res) => {
  try {
    const characterQueue = await CharacterQueue.find();
    res.json(characterQueue);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching character queue', error });
  }
});

router.post('/accept-character/:discordId', isApplicationTeam, async (req, res) => {
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
			discordId: characterQueueItem.discordId,
			age: characterQueueItem.age,
			birthplace: characterQueueItem.birthplace,
			gender: characterQueueItem.gender,
      appearance: characterQueueItem.appearance,
      personality: characterQueueItem.personality,
      backstory: characterQueueItem.backstory,
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

router.delete('/character-queue/:charName', isApplicationTeam, async (req, res) => {
  try {
    const { charName } = req.params;
    const deletedCharacter = await CharacterQueue.findOneAndDelete({ charName });

    if (!deletedCharacter) {
      return res.status(404).send('Character not found');
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting character from queue:', error);
    res.status(500).send('Server error');
  }
});



//reject characters

router.post('/reject-character/:discordId', isApplicationTeam, async (req, res) => {
  const { discordId } = req.params;
  const { rejectionMessage } = req.body;

  try {
    const characterQueueItem = await CharacterQueue.findOne({ discordId });
    if (!characterQueueItem) {
      return res.status(404).json({ message: 'Character not found in queue' });
    }

    const rejectedCharacter = new RejectedCharacter({
      charName: characterQueueItem.charName,
      discordId: characterQueueItem.discordId,
      age: characterQueueItem.age,
      birthplace: characterQueueItem.birthplace,
      gender: characterQueueItem.gender,
      appearance: characterQueueItem.appearance,
      personality: characterQueueItem.personality,
      backstory: characterQueueItem.backstory,
      rejectionMessage,
    });

    await rejectedCharacter.save();
    await CharacterQueue.findOneAndDelete({ discordId });

    res.status(201).json(rejectedCharacter);
  } catch (error) {
    console.error('Error rejecting character:', error);
    res.status(500).json({ message: 'Error rejecting character', error });
  }
});

router.get('/rejected-characters/:discordId', isApplicationTeam, async (req, res) => {
  try {
    const { discordId } = req.params;
    const rejectedCharacters = await RejectedCharacter.find({ discordId });
    res.json(rejectedCharacters);
  } catch (error) {
    console.error('Error fetching rejected characters:', error);
    res.status(500).send('Server error');
  }
});

router.delete('/rejected-characters/:charName', async (req, res) => {
  try {
    const { charName } = req.params;
    const deletedCharacter = await RejectedCharacter.findOneAndDelete({ charName });

    if (!deletedCharacter) {
      return res.status(404).send('Character not found');
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting rejected character:', error);
    res.status(500).send('Server error');
  }
});

router.delete('/characters/:charName', async (req, res) => {
  try {
    const { charName } = req.params;
    const character = await Character.findOne({ charName });

    if (!character) {
      return res.status(404).send('Character not found');
    }

		const characterData = character.toObject();
		characterData.isAlive = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (characterData as any)._id; // Remove the _id field

    const existingGraveyardEntry = await Graveyard.findOne({ charName });

    if (existingGraveyardEntry) {
      // Update the existing graveyard entry
      await Graveyard.updateOne(
        { charName },
        {
          ...characterData,
          DeathDate: new Date(),
        }
      );
    } else {
      // Create a new graveyard entry
      const graveyardEntry = new Graveyard({
        ...characterData,
        DeathDate: new Date(),
      });
      await graveyardEntry.save();
    }

    await Character.deleteOne({ charName });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting character:', error);
    res.status(500).send('Server error');
  }
});

router.post('/restore-character/:charName', isAdmin, async (req, res) => {
  try {
    const { charName } = req.params;
    const graveyardEntry = await Graveyard.findOne({ charName });

    if (!graveyardEntry) {
      return res.status(404).send('Character not found in graveyard');
    }

    const characterData = graveyardEntry.toObject();
		characterData.isAlive = true;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		delete (characterData as any)._id; // Remove the _id field
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		delete (characterData as any).DeathDate; // Remove the _id field

    const newCharacter = new Character(characterData);
    await newCharacter.save();

    await Graveyard.deleteOne({ charName });

    res.status(201).json(newCharacter);
  } catch (error) {
    console.error('Error restoring character:', error);
    res.status(500).send('Server error');
  }
});

export default router;
