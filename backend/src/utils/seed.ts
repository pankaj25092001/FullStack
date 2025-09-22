// src/utils/seed.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { Video } from '../models/video.model';

dotenv.config({ path: '.env' });

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined");
    }
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected for seeding...");

    await User.deleteMany({});
    await Video.deleteMany({});
    console.log("Cleared existing data.");

    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password456', 10);

    const users = await User.create([
      { username: 'moviefan', email: 'movie@example.com', password: hashedPassword1 },
      { username: 'musiclover', email: 'music@example.com', password: hashedPassword2 },
    ]);
    console.log(`${users.length} users created.`);
    const [movieUser, musicUser] = users;

    const videos = [
      {
        youtubeVideoId: 'u31fed_224s', // Oppenheimer Trailer - Guaranteed Embeddable
        title: 'Oppenheimer | New Trailer',
        description: 'Written and directed by Christopher Nolan, Oppenheimer is an IMAX®-shot epic thriller that thrusts audiences into the pulse-pounding paradox of the enigmatic man who must risk destroying the world in order to save it.',
        uploaderId: movieUser._id,
        thumbnailUrl: 'https://i.ytimg.com/vi/u31fed_224s/maxresdefault.jpg',
        duration: 181, // 3m 1s
        views: 78000000,
        likes: 1200000,
        category: 'Entertainment',
      },
      {
        youtubeVideoId: 'd9MyW72ELq0', // Queen - Bohemian Rhapsody - Guaranteed Embeddable
        title: 'Queen – Bohemian Rhapsody (Official Video Remastered)',
        description: 'REMASTERED IN HD TO CELEBRATE ONE BILLION VIEWS! Taken from A Night At The Opera, 1975.',
        uploaderId: musicUser._id,
        thumbnailUrl: 'https://i.ytimg.com/vi/d9MyW72ELq0/maxresdefault.jpg',
        duration: 367, // 6m 7s
        views: 1700000000,
        likes: 20000000,
        category: 'Music',
      },
      {
        youtubeVideoId: 'mP0_t-52nS8', // Blender Open Movie - Guaranteed Embeddable
        title: 'Charge - A Blender Open Movie',
        description: 'Charge is the 14th open movie from Blender Studio. A story about an old robot, a battery, and a choice.',
        uploaderId: movieUser._id,
        thumbnailUrl: 'https://i.ytimg.com/vi/mP0_t-52nS8/maxresdefault.jpg',
        duration: 210, // 3m 30s
        views: 1800000,
        likes: 120000,
        category: 'Education',
      }
    ];

    await Video.insertMany(videos);
    console.log(`${videos.length} videos created.`);

    console.log("✅ Database has been successfully seeded!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();