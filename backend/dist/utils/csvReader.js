"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCharacterByName = exports.getAllCharacters = void 0;
// backend/src/utils/csvReader.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const PLAYER_DATA_PATH = 'C:/Users/Jamie/Zomboid/Lua/ServerPlayersData';
const parseCSVFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)({ separator: ';' }))
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
                });
            }
            else {
                reject(new Error('No data in CSV file'));
            }
        })
            .on('error', (error) => {
            reject(error);
        });
    });
};
const getAllCharacters = async () => {
    const files = fs_1.default.readdirSync(PLAYER_DATA_PATH).filter(file => file.endsWith('_data.csv'));
    const characters = [];
    for (const file of files) {
        const filePath = path_1.default.join(PLAYER_DATA_PATH, file);
        try {
            const data = await parseCSVFile(filePath);
            characters.push(data);
        }
        catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
        }
    }
    return characters;
};
exports.getAllCharacters = getAllCharacters;
const getCharacterByName = async (charName) => {
    const characters = await (0, exports.getAllCharacters)();
    return characters.find(char => char.charName === charName);
};
exports.getCharacterByName = getCharacterByName;
