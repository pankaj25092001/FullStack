import { Router } from 'express';
// THE FIX: We are now importing the functions correctly with curly braces {}
import { createCheckoutSession, verifyPayment } from '../controllers/payment.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// These routes require a user to be logged in
router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/verify-session', protect, verifyPayment);

export default router;