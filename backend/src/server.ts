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
import zomboidRouter from './routes/zomboid';
import { importCharacters } from './utils/importCharacters';

dotenv.config();

const { MONGO_URI, SESSION_SECRET, PORT } = process.env;
if (!MONGO_URI || !SESSION_SECRET || !PORT) {
  throw new Error('Missing required environment variables');
}

const app = express();

app.use(cors({ origin: process.env.HOST_URL, credentials: true }));

app.use(bodyParser.json());

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: 'sessions',
  }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/api', characterRouter);
app.use('/api', usersRouter);
app.use('/api/zomboid', zomboidRouter);

app.post('/api/import-characters', async (req, res) => {
  try {
    await importCharacters();
    res.status(200).send('Characters imported successfully');
  } catch (error) {
    console.error('Error importing characters:', error);
    res.status(500).send('Failed to import characters');
  }
});

importCharacters().catch(error => {
  console.error('Error during initial character import:', error);
});

//run import characters every 60 seconds
cron.schedule('*/60 * * * * *', () => {
  importCharacters().catch(error => {
    console.error('Error during scheduled character import:', error);
  });
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Database connected successfully');
    const port = parseInt(PORT, 10);
    if (isNaN(port)) {
      console.error(`Invalid port number: ${PORT}`);
      process.exit(1);
    }
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Database connection error:', error.message);
    console.error(error.stack);
  });
