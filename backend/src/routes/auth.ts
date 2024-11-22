import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      let isMember = false;
      let retryCount = 0;
      const maxRetries = 5;

      const fetchGuilds = async () => {
        const response = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data = await response.json();

        // Check for rate limiting
        if (data.message === 'You are being rate limited.') {
          const retryAfter = data.retry_after * 1000; // Convert to milliseconds
          console.log(`Rate limited. Retrying after ${retryAfter} ms`);
          if (retryCount < maxRetries) {
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, retryAfter));
            return fetchGuilds(); // Retry the request
          } else {
            console.error('Max retries reached. Could not fetch guilds.');
            return;
          }
        }

        // Ensure data is an array before calling some
        if (Array.isArray(data)) {
          // Check if the user is a member of the specified guild
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          isMember = data.some((guild: any) => guild.id === guildId);
        } else {
          console.error('Expected an array but got:', data);
        }
      };

      await fetchGuilds();

      user.isMember = isMember;
      await user.save();
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

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
