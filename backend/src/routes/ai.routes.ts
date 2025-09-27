import { Router } from 'express';
import { transcribeAudio } from '../controllers/ai.controller';
import { protect } from '../middlewares/auth.middleware';
import multer from 'multer';

const router = Router();

// Configure multer to handle the audio file in memory
const upload = multer({ storage: multer.memoryStorage() });

// This route is protected. A user must be logged in to use the AI feature.
// It runs three steps:
// 1. protect: Verifies the user's token.
// 2. upload.single('audio'): Handles the single file upload named 'audio'.
// 3. transcribeAudio: Our controller logic runs.
router.post('/transcribe', protect, upload.single('audio'), transcribeAudio);

export default router;