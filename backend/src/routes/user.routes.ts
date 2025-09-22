// This is the complete, correct file for src/routes/user.routes.ts

import { Router } from 'express';
// Make sure all functions you need are imported
import { registerUser, loginUser, logoutUser, getUserProfile } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware'; // Import our security guard

const router = Router();

// --- Public Routes (These should not change) ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// --- New Protected Route for Testing ---
// When a request comes to '/profile', it will FIRST run the 'protect' function.
// If the token is valid, it will THEN run the 'getUserProfile' function.
router.get('/profile', protect, getUserProfile);

export default router;