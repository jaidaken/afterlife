import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY'); // Use your actual secret key
    req.user = decoded; // Attach the decoded token to req.user
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};
