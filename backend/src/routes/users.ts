import express from 'express';
import User from '../models/User';

const router = express.Router();

// Endpoint to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server error');
  }
});

// Endpoint to get a user by discordId
router.get('/users/:discordId', async (req, res) => {
  try {
    const user = await User.findOne({ discordId: req.params.discordId });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Server error');
  }
});

export default router;
