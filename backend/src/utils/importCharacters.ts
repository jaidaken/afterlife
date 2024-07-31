import { getAllCharacters } from './csvReader';
import Character from '../models/Character';
import { encryptPassword, generateRandomPassword } from './passwordUtils';

export const importCharacters = async () => {
  try {
    const characters = await getAllCharacters();

    await Promise.all(
      characters.map(async (character) => {
        const password = generateRandomPassword();
        const encryptedPassword = encryptPassword(password);

        const updatedCharacter = {
          ...character,
          password: encryptedPassword,
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
