import { Router } from 'express';
import { getCart, addItemToCart, removeItemFromCart } from '../controllers/cart.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// This is a very clean way to protect all routes in this file.
// The 'protect' middleware will run before any of the routes below it.
router.use(protect);

// Define the routes
router.get('/', getCart);
router.post('/add', addItemToCart);
router.delete('/remove/:itemId', removeItemFromCart);

export default router;