// src/routes/payment.routes.ts

import { Router } from 'express';
import { createCheckoutSession, verifyPayment } from '../controllers/payment.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Both of these routes require a user to be logged in
router.use(protect);

router.post('/create-checkout-session', createCheckoutSession);
router.post('/verify-session', verifyPayment); // Our new, simple verification route

export default router;