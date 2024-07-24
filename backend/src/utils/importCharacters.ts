// backend/src/utils/importCharacters.ts
import { ICharacter } from '../models/Character';
import { getAllCharacters } from './csvReader';
import Character from '../models/Character';

export const importCharacters = async () => {
  try {
    const characters: ICharacter[] = (await getAllCharacters()).map(character => character as unknown as ICharacter);

    await Promise.all(
      characters.map(async (character) => {
        await Character.findOneAndUpdate(
          { charName: character.charName }, // Match by charName
          { ...character }, // Update the character data
          { new: true, upsert: true } // Create a new document if no match is found
        );
      })
    );

    console.log('Characters imported successfully');
  } catch (error) {
    console.error('Error importing characters:', error);
  }
};
