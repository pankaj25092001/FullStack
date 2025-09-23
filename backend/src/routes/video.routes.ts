// src/routes/video.routes.ts

import { Router } from 'express';
import { getAllVideos, getVideoById } from '../controllers/video.controller';

const router = Router();

// Our main, powerful route for fetching, searching, sorting, and filtering
router.get('/', getAllVideos);

// A simple route to get one video by its ID
router.get('/:videoId', getVideoById);

export default router;