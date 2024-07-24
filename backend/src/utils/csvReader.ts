// backend/src/utils/csvReader.ts
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const PLAYER_DATA_PATH = 'C:/Users/Jamie/Zomboid/Lua/ServerPlayersData';

interface Character {
  username: string;
  steamID: string;
  charName: string;
  profession: string;
  isAlive: boolean;
  zombieKills: number;
  survivorKills: number;
  hoursSurvived: number;
}

const parseCSVFile = (filePath: string): Promise<Character> => {
  return new Promise<Character>((resolve, reject) => {
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        if (results.length > 0) {
          const character = results[0];
          resolve({
            username: character.username,
            steamID: character.steamID,
            charName: character.charName,
            profession: character.profession,
            isAlive: character.isAlive === 'true',
            zombieKills: isNaN(parseInt(character.zombieKills, 10)) ? 0 : parseInt(character.zombieKills, 10),
            survivorKills: isNaN(parseInt(character.survivorKills, 10)) ? 0 : parseInt(character.survivorKills, 10),
            hoursSurvived: isNaN(parseFloat(character.hoursSurvived)) ? 0 : parseFloat(character.hoursSurvived),
          });
        } else {
          reject(new Error('No data in CSV file'));
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

export const getAllCharacters = async (): Promise<Character[]> => {
  const files = fs.readdirSync(PLAYER_DATA_PATH).filter(file => file.endsWith('_data.csv'));
  const characters: Character[] = [];

  for (const file of files) {
    const filePath = path.join(PLAYER_DATA_PATH, file);

    try {
      const data = await parseCSVFile(filePath);
      characters.push(data);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  }

  return characters;
};

export const getCharacterByName = async (charName: string): Promise<Character | undefined> => {
  const characters = await getAllCharacters();
  return characters.find(char => char.charName === charName);
};
