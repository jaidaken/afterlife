"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
router.get('/users', async (req, res) => {
    try {
        const users = await User_1.default.find();
        res.json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');
    }
});
router.get('/users/:discordId', async (req, res) => {
    try {
        const user = await User_1.default.findOne({ discordId: req.params.discordId });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Server error');
    }
});
exports.default = router;
