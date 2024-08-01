import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import dotenv from 'dotenv';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import User from '../models/User';

dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user.discordId);
});

passport.deserializeUser(async (discordId, done) => {
  try {
    const user = await User.findOne({ discordId });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new DiscordStrategy(
  {
    clientID: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    callbackURL: process.env.DISCORD_CALLBACK_URL!,
    scope: ['identify', 'guilds']
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id, username, discriminator, avatar } = profile;
    try {
      let user = await User.findOne({ discordId: id });

      if (user) {
        user.username = `${username}#${discriminator}`;
        user.avatar = avatar ?? '';
        await user.save();
      } else {
        user = new User({
          discordId: id,
          username: `${username}#${discriminator}`,
          avatar,
          isAdmin: false,
        });
        await user.save();
      }

      // Check if the user is a member of the server
      const guildId = process.env.DISCORD_GUILD_ID!;
      const response = await axios.get(`https://discord.com/api/v9/users/@me/guilds`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const isMember = response.data.some((guild: any) => guild.id === guildId);

      user.isMember = isMember;
      await user.save();

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Configure axios to use axios-retry
axiosRetry(axios, {
  retries: 3, // Number of retries
  retryDelay: (retryCount) => {
    return axiosRetry.exponentialDelay(retryCount);
  },
  retryCondition: (error) => {
    // Retry only if the error status is 429 (rate limit)
    return error.response?.status === 429;
  },
});

const router = Router();

router.get('/discord', passport.authenticate('discord'));

router.get(
  '/discord/callback',
  passport.authenticate('discord', {
    failureRedirect: process.env.FAIL_REDIRECT_URL,
    successRedirect: process.env.SUCCESS_REDIRECT_URL,
  })
);

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

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

router.get('/me', isAuthenticated, (req, res) => {
  res.json(req.user);
});

export const authRouter = router;
