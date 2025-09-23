import { Router } from 'express';
import { registerUser, loginUser, logoutUser, getUserProfile, refreshAccessToken } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// --- Public Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);

// --- Protected Routes ---
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getUserProfile);

export default router;