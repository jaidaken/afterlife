import express from 'express';
import { encryptPassword, decryptPassword } from '../utils/passwordUtils';
import { isApplicationTeam } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/encrypt-password', isApplicationTeam, (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  const encryptedPassword = encryptPassword(password);
  res.json({ encryptedPassword });
});

router.post('/decrypt-password', isApplicationTeam, (req, res) => {
  const { encryptedPassword } = req.body;
  if (!encryptedPassword) {
    return res.status(400).json({ error: 'Encrypted password is required' });
  }
  const decryptedPassword = decryptPassword(encryptedPassword);
  res.json({ decryptedPassword });
});

export default router;
