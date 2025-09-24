
import { Router } from 'express';
import { getOrdersForUser } from '../controllers/order.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// A user MUST be logged in to see their orders.
// We protect the entire router.
router.use(protect);

router.get('/', getOrdersForUser);

export default router;