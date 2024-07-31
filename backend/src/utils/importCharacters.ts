import { getAllCharacters } from './csvReader';
import Character from '../models/Character';

export const importCharacters = async () => {
  try {
    const characters = await getAllCharacters();

    await Promise.all(
      characters.map(async (character) => {
        const updatedCharacter = {
          ...character
        };

        await Character.findOneAndUpdate(
          { charName: character.charName },
          { ...updatedCharacter },
          { new: true, upsert: true }
        );
      })
    );

    console.log('Characters imported successfully');
  } catch (error) {
    console.error('Error importing characters:', error);
  }
};
