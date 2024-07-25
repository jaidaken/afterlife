"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const csvReader_1 = require("../utils/csvReader");
const Character_1 = __importDefault(require("../models/Character"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
router.post('/characters/import', async (req, res) => {
    try {
        const characters = await (0, csvReader_1.getAllCharacters)();
        const savedCharacters = await Promise.all(characters.map(async (char) => {
            try {
                return await Character_1.default.findOneAndUpdate({ charName: char.charName }, char, { new: true, upsert: true });
            }
            catch (error) {
                console.error(`Error updating character ${char.charName}:`, error);
                return null;
            }
        }));
        res.json(savedCharacters.filter(char => char !== null));
    }
    catch (error) {
        res.status(500).json({ message: 'Error importing characters', error });
    }
});
router.get('/characters', async (req, res) => {
    try {
        const characters = await Character_1.default.find();
        res.json(characters);
    }
    catch (error) {
        console.error('Error fetching characters:', error);
        res.status(500).send('Server error');
    }
});
router.get('/characters/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const characters = await Character_1.default.find({ userId });
        res.json(characters);
    }
    catch (error) {
        console.error('Error fetching user characters:', error);
        res.status(500).send('Server error');
    }
});
router.get('/characters/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const character = await Character_1.default.findOne({ charName: name });
        if (character) {
            res.json(character);
        }
        else {
            res.status(404).json({ message: 'Character not found' });
        }
    }
    catch (error) {
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
        const character = await Character_1.default.findOne({ charName });
        if (!character) {
            return res.status(404).json({ message: 'Character not found' });
        }
        const user = await User_1.default.findOne({ discordId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.characters.push(character.charName);
        await user.save();
        console.log(`Assigned character ${charName} to user ${discordId}`);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error assigning character', error });
    }
});
router.post('/characters', async (req, res) => {
    const { username, steamID, charName, profession, isAlive, zombieKills, survivorKills, hoursSurvived } = req.body;
    if (!charName) {
        return res.status(400).json({ message: 'Character name is required' });
    }
    try {
        const newCharacter = new Character_1.default({
            username,
            steamID,
            charName,
            profession,
            isAlive,
            zombieKills,
            survivorKills,
            hoursSurvived,
        });
        const savedCharacter = await newCharacter.save();
        res.status(201).json(savedCharacter);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding character', error });
    }
});
exports.default = router;
