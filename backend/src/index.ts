// src/index.ts

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import userRouter from './routes/user.routes';

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

// --- Middlewares ---
// Enable CORS to allow our frontend to communicate with this backend
app.use(cors());
// Enable the express app to parse JSON formatted request bodies
app.use(express.json());

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('Bade Bhai server is running! 🚀');
});
app.use('/api/v1/users', userRouter);
// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`✅ Server is live and listening on http://localhost:${PORT}`);
});