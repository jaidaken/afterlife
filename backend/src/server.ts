import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
import MongoStore from 'connect-mongo';
import https from 'https';
import fs from 'fs';
import { authRouter } from './routes/auth';
import characterRouter from './routes/characters';
import usersRouter from './routes/users';
import zomboidRouter from './routes/zomboid';
import passwordRoutes from './routes/password';
import imageRouter from './routes/image';
import { importCharacters } from './utils/importCharacters';

dotenv.config();

const { MONGO_URI, SESSION_SECRET, PORT, SSL_KEY_PATH, SSL_CERT_PATH } = process.env;
if (!MONGO_URI || !SESSION_SECRET || !PORT || !SSL_KEY_PATH || !SSL_CERT_PATH ) {
  throw new Error('Missing required environment variables');
}
const app = express();

app.use(cors({ origin: process.env.HOST_URL, credentials: true }));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

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
app.use('/api', passwordRoutes);
app.use('/api/image', imageRouter);

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

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Database connected successfully');
    const port = parseInt(PORT, 10);
    if (isNaN(port)) {
      console.error(`Invalid port number: ${PORT}`);
      process.exit(1);
    }

    const options = {
      key: fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH),
    };

    https.createServer(options, app).listen(port, '49.13.213.64', () => {
      console.log(`Server running on https://49.13.213.64:${port}`);
    });

    const db = mongoose.connection;
    const characterCollection = db.collection('characters');
    const changeStream = characterCollection.watch();

    changeStream.on('change', (change) => {
      console.log('Change detected in characters database:');
      importCharacters().catch(error => {
        console.error('Error importing characters after change detected:', error);
      });
    });

  })
  .catch(error => {
    console.error('Database connection error:', error.message);
    console.error(error.stack);
  });
