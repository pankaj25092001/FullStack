import { Request, Response } from 'express';
import OpenAI from 'openai';
import { toFile } from 'openai/uploads'; // 1. Import the special helper tool
import { AuthRequest } from '../middlewares/auth.middleware';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const transcribeAudio = async (req: AuthRequest, res: Response) => {
  // Check if multer has successfully processed a file
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file was uploaded.' });
  }

  try {
    // --- THE FIX IS HERE ---
    // 2. We use the 'toFile' helper to convert our in-memory audio buffer
    //    into a format that the OpenAI API understands perfectly.
    const audioFile = await toFile(req.file.buffer, req.file.originalname);

    // 3. We now pass this correctly formatted file to the Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });
    // --- END OF FIX ---

    // Send the transcribed text back to the frontend
    res.status(200).json({ text: transcription.text });

  } catch (error) {
    console.error("OpenAI Whisper API error:", error);
    res.status(500).json({ message: 'Error transcribing audio.' });
  }
};
