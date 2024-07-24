import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
import MongoStore from 'connect-mongo';
import { authRouter } from './routes/auth';
import { characterRouter } from './routes/characters';

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
