"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importCharacters = void 0;
const csvReader_1 = require("./csvReader");
const Character_1 = __importDefault(require("../models/Character"));
const importCharacters = async () => {
    try {
        const characters = (await (0, csvReader_1.getAllCharacters)()).map(character => character);
        await Promise.all(characters.map(async (character) => {
            await Character_1.default.findOneAndUpdate({ charName: character.charName }, { ...character }, { new: true, upsert: true });
        }));
        console.log('Characters imported successfully');
    }
    catch (error) {
        console.error('Error importing characters:', error);
    }
};
exports.importCharacters = importCharacters;
