// backend/src/routes/zomboid.ts
import express from 'express';
import { sendRconCommand } from '../utils/rconClient';
import { isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Endpoint to send commands to the Zomboid server
router.post('/command', isAdmin, async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  try {
    const output = await sendRconCommand(command);
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: 'Error sending command' });
  }
});

export default router;
