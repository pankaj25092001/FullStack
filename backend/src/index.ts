import dotenv from 'dotenv';
dotenv.config(); // This MUST be the first line to run

import app from './app'; // We import our newly created app
import connectDB from './config/db';

const PORT = process.env.PORT || 8000;

// This is the professional way to start the server.
// It ensures the database is connected BEFORE we start listening for requests.
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Database connected. Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("FATAL ERROR: Failed to start server.", error);
    process.exit(1);
  }
};

startServer();