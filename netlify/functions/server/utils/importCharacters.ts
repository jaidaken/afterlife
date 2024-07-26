import { ICharacter } from '../models/Character';
import { getAllCharacters } from './csvReader';
import Character from '../models/Character';

export const importCharacters = async () => {
  try {
    const characters: ICharacter[] = (await getAllCharacters()).map(character => character as unknown as ICharacter);

    await Promise.all(
      characters.map(async (character) => {
        await Character.findOneAndUpdate(
          { charName: character.charName },
          { ...character },
          { new: true, upsert: true }
        );
      })
    );

    console.log('Characters imported successfully');
  } catch (error) {
    console.error('Error importing characters:', error);
  }
};
