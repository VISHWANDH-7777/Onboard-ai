import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/User.js';

export const authRouter = express.Router();
const sessionStore = new Map();

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        userId: uuidv4(),
        email,
        password: hashedPassword,
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      process.env.JWT_SECRET || 'nebula_dev_secret',
      { expiresIn: '8h' },
    );

    sessionStore.set(user.userId, {
      token,
      createdAt: new Date().toISOString(),
    });

    return res.json({
      token,
      user: {
        userId: user.userId,
        email: user.email,
      },
      session: sessionStore.get(user.userId),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
});
