import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
import MongoStore from 'connect-mongo';
import cron from 'node-cron';
import { authRouter } from './routes/auth';
import characterRouter from './routes/characters';
import { getAllCharacters } from './utils/csvReader';
import Character, { ICharacter } from './models/Character';
import { ObjectId } from 'mongodb';

dotenv.config();

// Ensure the environment variables are set properly
const { MONGO_URI, SESSION_SECRET, PORT } = process.env;
if (!MONGO_URI || !SESSION_SECRET || !PORT) {
  throw new Error('Missing required environment variables');
}

const app = express();

// CORS configuration
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Body parser configuration
app.use(bodyParser.json());

// Session configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: 'sessions',
  }),
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up routes
app.use('/auth', authRouter);
app.use('/api', characterRouter); // Add character routes

const importCharacters = async () => {
  try {
    const characters: ICharacter[] = (await getAllCharacters()).map(character => character as unknown as ICharacter);

    await Promise.all(
      characters.map(async (character) => {
        await Character.findOneAndUpdate(
          { charName: character.charName }, // Match by charName
          { ...character }, // Update the character data
          { new: true, upsert: true } // Create a new document if no match is found
        );
      })
    );

    console.log('Characters imported successfully');
  } catch (error) {
    console.error('Error importing characters:', error);
  }
};

// Run importCharacters at server startup
importCharacters();

// Schedule importCharacters to run every hour
cron.schedule('0 * * * *', importCharacters);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });
