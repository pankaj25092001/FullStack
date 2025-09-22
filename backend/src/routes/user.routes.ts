import { Router } from 'express';
// Import all three controller functions
import { registerUser, loginUser, logoutUser } from '../controllers/user.controller';

const router = Router();

// --- Auth Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser); // New Logout Route

export default router;