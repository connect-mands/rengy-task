import express from 'express';
import { signUp, signIn, refresh, getMe, signUpValidation, signInValidation, refreshValidation } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/signup', validate(signUpValidation), signUp);
router.post('/signin', loginLimiter, validate(signInValidation), signIn);
router.post('/refresh', validate(refreshValidation), refresh);
router.get('/me', protect, getMe);

export default router;
