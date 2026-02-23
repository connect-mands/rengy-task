import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { body } from 'express-validator';

const generateTokens = (id) => {
  const accessToken = jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
  const refreshToken = jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  return { accessToken, refreshToken };
};

export const signUp = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({ email, password, name });
    const { accessToken, refreshToken } = generateTokens(user._id);
    res.status(201).json({
      success: true,
      data: {
        user: { id: user._id, email: user.email, name: user.name },
        accessToken,
        refreshToken,
        expiresIn: 900
      }
    });
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const { accessToken, refreshToken } = generateTokens(user._id);
    res.json({
      success: true,
      data: {
        user: { id: user._id, email: user.email, name: user.name },
        accessToken,
        refreshToken,
        expiresIn: 900
      }
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { accessToken, refreshToken: newRefresh } = generateTokens(decoded.id);
    res.json({
      success: true,
      data: { accessToken, refreshToken: newRefresh, expiresIn: 900 }
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

export const getMe = async (req, res, next) => {
  res.json({ success: true, data: { user: req.user } });
};

export const signUpValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password at least 6 characters'),
  body('name').trim().notEmpty().isLength({ max: 100 }).withMessage('Name required')
];

export const signInValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];

export const refreshValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token required')
];
