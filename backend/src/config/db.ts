import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in the .env file");
    }
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// This is the crucial line. The "default" keyword is what allows us
// to import it with `import connectDB from ...`
export default connectDB;