"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const node_cron_1 = __importDefault(require("node-cron"));
const auth_1 = require("./routes/auth");
const characters_1 = __importDefault(require("./routes/characters"));
const users_1 = __importDefault(require("./routes/users"));
const importCharacters_1 = require("./utils/importCharacters");
dotenv_1.default.config();
const { MONGO_URI, SESSION_SECRET, PORT } = process.env;
if (!MONGO_URI || !SESSION_SECRET) {
    throw new Error('Missing required environment variables');
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true }));
app.use(body_parser_1.default.json());
app.use((0, express_session_1.default)({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: MONGO_URI,
        collectionName: 'sessions',
    }),
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/auth', auth_1.authRouter);
app.use('/api', characters_1.default);
app.use('/api', users_1.default);
app.post('/api/import-characters', async (req, res) => {
    try {
        await (0, importCharacters_1.importCharacters)();
        res.status(200).send('Characters imported successfully');
    }
    catch (error) {
        console.error('Error importing characters:', error);
        res.status(500).send('Failed to import characters');
    }
});
(0, importCharacters_1.importCharacters)();
node_cron_1.default.schedule('*/10 * * * *', importCharacters_1.importCharacters);
mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch(error => {
    console.error('Database connection error:', error);
});
