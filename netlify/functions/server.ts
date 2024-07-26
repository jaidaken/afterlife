import cron from 'node-cron';
import authRoutes from './routes/auth';
import characterRouter from './routes/characters';
import usersRouter from './routes/users';
import { importCharacters } from './utils/importCharacters';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import mongoose from 'mongoose';
import serverless from 'serverless-http';

dotenv.config();

const { MONGO_URI, SESSION_SECRET } = process.env;
if (!MONGO_URI || !SESSION_SECRET) {
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

app.use('/api', characterRouter);
app.use('/api', usersRouter);
app.use('/auth', authRoutes);

app.post('/api/import-characters', async (req, res) => {
  try {
    await importCharacters();
    res.status(200).send('Characters imported successfully');
  } catch (error) {
    console.error('Error importing characters:', error);
    res.status(500).send('Failed to import characters');
  }
});

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', (error as Error).message);
    console.error((error as Error).stack);
    process.exit(1); // Exit the process with a failure code
  }
};

connectToDatabase()
  .then(() => {
    console.log('Database connected successfully.');

    importCharacters().catch(error => {
      console.error('Error during initial character import:', error);
    });

    cron.schedule('*/10 * * * *', () => {
      importCharacters().catch(error => {
        console.error('Error during scheduled character import:', error);
      });
    });

  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process with a failure code
	});

	export const handler = serverless(app);
