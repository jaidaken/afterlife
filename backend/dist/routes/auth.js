"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const passport_discord_1 = require("passport-discord");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.default.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
});
passport_1.default.use(new passport_discord_1.Strategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
    const { id, username, discriminator, avatar } = profile;
    try {
        let user = await User_1.default.findOne({ discordId: id });
        if (user) {
            user.username = `${username}#${discriminator}`;
            user.avatar = avatar ?? '';
            await user.save();
        }
        else {
            user = new User_1.default({
                discordId: id,
                username: `${username}#${discriminator}`,
                avatar,
                isAdmin: false,
            });
            await user.save();
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}));
const router = (0, express_1.Router)();
router.get('/discord', passport_1.default.authenticate('discord'));
router.get('/discord/callback', passport_1.default.authenticate('discord', {
    failureRedirect: 'http://localhost:5173/auth/failed',
    successRedirect: 'http://localhost:5173/dashboard',
}));
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Logout successful' });
        });
    });
});
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};
router.get('/me', isAuthenticated, (req, res) => {
    res.json(req.user);
});
exports.authRouter = router;
