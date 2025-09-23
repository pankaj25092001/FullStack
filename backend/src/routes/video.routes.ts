// src/routes/video.routes.ts

import { Router } from 'express';
import { getAllVideos, getVideoById, toggleLike } from '../controllers/video.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Our main, powerful route for fetching, searching, sorting, and filtering
router.get('/', getAllVideos);

// A simple route to get one video by its ID
router.get('/:videoId', getVideoById);
// A user must be logged in to like a video.
router.post('/:videoId/toggle-like', protect, toggleLike);

export default router;