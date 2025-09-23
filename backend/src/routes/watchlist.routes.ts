import { Router } from 'express';
import { getWatchlist, toggleWatchlist } from '../controllers/watchlist.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();
router.use(protect);

router.get('/', getWatchlist);
router.post('/toggle', toggleWatchlist);

export default router;