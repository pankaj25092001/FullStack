import { Router } from 'express';
import { submitVideoByUrl } from '../controllers/submission.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// A user MUST be logged in to submit a new video.
router.post('/by-url', protect, submitVideoByUrl);

export default router;