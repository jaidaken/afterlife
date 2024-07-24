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
import usersRouter from './routes/users';
import { importCharacters } from './utils/importCharacters';

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
app.use('/api', characterRouter);
app.use('/api', usersRouter);

app.post('/api/import-characters', async (req, res) => {
  try {
    await importCharacters();
    res.status(200).send('Characters imported successfully');
  } catch (error) {
    console.error('Error importing characters:', error);
    res.status(500).send('Failed to import characters');
  }
});

// Run importCharacters at server startup
importCharacters();

// Schedule importCharacters to run every hour
cron.schedule('*/10 * * * *', importCharacters);

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
