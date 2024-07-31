// backend/src/routes/image.ts
import express from 'express';
import multer from 'multer';
import { convertToWebpAndCrop } from '../utils/imageUtils';

const router = express.Router();
const upload = multer();

router.post('/convert', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const webpBuffer = await convertToWebpAndCrop(req.file.buffer, req.body.charName);
    res.send(webpBuffer.toString('base64'));
  } catch (error) {
    console.error('Error processing image', error);
    res.status(500).send('Error processing image');
  }
});

export default router;
