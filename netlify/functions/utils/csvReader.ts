// backend/src/utils/csvReader.ts
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import dotenv from 'dotenv';

dotenv.config();

const PLAYER_DATA_PATH = process.env.CVS_LOCATION || '';

interface Character {
	charName: string;
	profession: string;
	username: string;
	steamID: string;
	isAlive: boolean;
	zombieKills: number;
	survivorKills: number;
	hoursSurvived: number;
	health: number;
  hunger: number;
  thirst: number;
  endurance: number;
  fatigue: number;
  boredom: number;
  panic: number;
  stress: number;
  weight: number;
  calories: number;
  carbs: number;
  lipids: number;
  proteins: number;
  x: number;
  y: number;
  z: number;
  direction: string;
  bodyDamage: number;
  temperature: number;
  wetness: number;
  infectionLevel: number;
  Combat: number;
  Axe: number;
  LongBlunt: number;
  ShortBlunt: number;
  LongBlade: number;
  ShortBlade: number;
  Spear: number;
  Maintenance: number;
  Firearm: number;
  Aiming: number;
  Reloading: number;
  Crafting: number;
  Carpentry: number;
  Cooking: number;
  Farming: number;
  FirstAid: number;
  Electrical: number;
  Metalworking: number;
  Mechanics: number;
  Tailoring: number;
  Survivalist: number;
  Fishing: number;
  Trapping: number;
  Foraging: number;
  Passive: number;
  Fitness: number;
  Strength: number;
  Agility: number;
  Sprinting: number;
  Lightfooted: number;
  Nimble: number;
  Sneaking: number;
}

const parseCSVFile = (filePath: string): Promise<Character> => {
  return new Promise<Character>((resolve, reject) => {
    const results: Character[] = [];

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
            isAlive: String(character.isAlive).toLowerCase() === 'true',
            zombieKills: isNaN(Number(character.zombieKills)) ? 0 : Number(character.zombieKills),
            survivorKills: isNaN(Number(character.survivorKills)) ? 0 : Number(character.survivorKills),
            hoursSurvived: isNaN(Number(character.hoursSurvived)) ? 0 : Number(character.hoursSurvived),
            health: isNaN(Number(character.health)) ? 0 : Number(character.health),
            hunger: isNaN(Number(character.hunger)) ? 0 : Number(character.hunger),
            thirst: isNaN(Number(character.thirst)) ? 0 : Number(character.thirst),
            endurance: isNaN(Number(character.endurance)) ? 0 : Number(character.endurance),
            fatigue: isNaN(Number(character.fatigue)) ? 0 : Number(character.fatigue),
            boredom: isNaN(Number(character.boredom)) ? 0 : Number(character.boredom),
            panic: isNaN(Number(character.panic)) ? 0 : Number(character.panic),
            stress: isNaN(Number(character.stress)) ? 0 : Number(character.stress),
            weight: isNaN(Number(character.weight)) ? 0 : Number(character.weight),
            calories: isNaN(Number(character.calories)) ? 0 : Number(character.calories),
            carbs: isNaN(Number(character.carbs)) ? 0 : Number(character.carbs),
            lipids: isNaN(Number(character.lipids)) ? 0 : Number(character.lipids),
            proteins: isNaN(Number(character.proteins)) ? 0 : Number(character.proteins),
            x: isNaN(Number(character.x)) ? 0 : Number(character.x),
            y: isNaN(Number(character.y)) ? 0 : Number(character.y),
            z: isNaN(Number(character.z)) ? 0 : Number(character.z),
            direction: character.direction,
            bodyDamage: isNaN(Number(character.bodyDamage)) ? 0 : Number(character.bodyDamage),
            temperature: isNaN(Number(character.temperature)) ? 0 : Number(character.temperature),
            wetness: isNaN(Number(character.wetness)) ? 0 : Number(character.wetness),
            infectionLevel: isNaN(Number(character.infectionLevel)) ? 0 : Number(character.infectionLevel),
            Combat: isNaN(Number(character.Combat)) ? 0 : Number(character.Combat),
            Axe: isNaN(Number(character.Axe)) ? 0 : Number(character.Axe),
            LongBlunt: isNaN(Number(character.LongBlunt)) ? 0 : Number(character.LongBlunt),
            ShortBlunt: isNaN(Number(character.ShortBlunt)) ? 0 : Number(character.ShortBlunt),
            LongBlade: isNaN(Number(character.LongBlade)) ? 0 : Number(character.LongBlade),
            ShortBlade: isNaN(Number(character.ShortBlade)) ? 0 : Number(character.ShortBlade),
            Spear: isNaN(Number(character.Spear)) ? 0 : Number(character.Spear),
            Maintenance: isNaN(Number(character.Maintenance)) ? 0 : Number(character.Maintenance),
            Firearm: isNaN(Number(character.Firearm)) ? 0 : Number(character.Firearm),
            Aiming: isNaN(Number(character.Aiming)) ? 0 : Number(character.Aiming),
            Reloading: isNaN(Number(character.Reloading)) ? 0 : Number(character.Reloading),
            Crafting: isNaN(Number(character.Crafting)) ? 0 : Number(character.Crafting),
            Carpentry: isNaN(Number(character.Carpentry)) ? 0 : Number(character.Carpentry),
            Cooking: isNaN(Number(character.Cooking)) ? 0 : Number(character.Cooking),
            Farming: isNaN(Number(character.Farming)) ? 0 : Number(character.Farming),
            FirstAid: isNaN(Number(character.FirstAid)) ? 0 : Number(character.FirstAid),
            Electrical: isNaN(Number(character.Electrical)) ? 0 : Number(character.Electrical),
            Metalworking: isNaN(Number(character.Metalworking)) ? 0 : Number(character.Metalworking),
            Mechanics: isNaN(Number(character.Mechanics)) ? 0 : Number(character.Mechanics),
            Tailoring: isNaN(Number(character.Tailoring)) ? 0 : Number(character.Tailoring),
            Survivalist: isNaN(Number(character.Survivalist)) ? 0 : Number(character.Survivalist),
            Fishing: isNaN(Number(character.Fishing)) ? 0 : Number(character.Fishing),
            Trapping: isNaN(Number(character.Trapping)) ? 0 : Number(character.Trapping),
            Foraging: isNaN(Number(character.Foraging)) ? 0 : Number(character.Foraging),
            Passive: isNaN(Number(character.Passive)) ? 0 : Number(character.Passive),
            Fitness: isNaN(Number(character.Fitness)) ? 0 : Number(character.Fitness),
            Strength: isNaN(Number(character.Strength)) ? 0 : Number(character.Strength),
            Agility: isNaN(Number(character.Agility)) ? 0 : Number(character.Agility),
            Sprinting: isNaN(Number(character.Sprinting)) ? 0 : Number(character.Sprinting),
            Lightfooted: isNaN(Number(character.Lightfooted)) ? 0 : Number(character.Lightfooted),
            Nimble: isNaN(Number(character.Nimble)) ? 0 : Number(character.Nimble),
            Sneaking: isNaN(Number(character.Sneaking)) ? 0 : Number(character.Sneaking),
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
