// src/utils/seed.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model';
import { Video } from '../models/video.model';

dotenv.config({ path: '.env' });

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) throw new Error("MONGO_URI is not defined");
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected for seeding...");

    // --- WIPE ALL EXISTING DATA ---
    await User.deleteMany({});
    await Video.deleteMany({});
    console.log("Cleared existing users and videos.");

    // --- CREATE 4 NEW USERS ---
    const users = await User.create([
      { username: 'techwiz', email: 'tech@example.com', password: 'password123' },
      { username: 'moviemaniac', email: 'movie@example.com', password: 'password123' },
      { username: 'musichead', email: 'music@example.com', password: 'password123' },
      { username: 'gamergod', email: 'gamer@example.com', password: 'password123' },
    ]);
    console.log(`${users.length} users created.`);
    const [techUser, movieUser, musicUser, gameUser] = users;

    // --- CREATE 10 DIVERSE VIDEOS ---
    const videos = [
      // 1. Premium Tech Course
      {
        youtubeVideoId: 'lnV34uLEBCI',
        title: 'React Course - Beginner\'s Tutorial',
        description: 'Learn React from scratch. This is a full-length, comprehensive tutorial for beginners to advanced.',
        uploaderId: techUser._id,
        thumbnailUrl: 'https://i.ytimg.com/vi/lnV34uLEBCI/maxresdefault.jpg',
        duration: 9720, // 2h 42m
        views: 8900000,
        likes: 250000,
        category: 'Tech',
        monetization: { type: 'premium', price: { rent: 150, buy: 500 } }
      },
      // 2. Free Entertainment Trailer
      {
        youtubeVideoId: 'u31fed_224s',
        title: 'Oppenheimer | New Trailer',
        description: 'Written and directed by Christopher Nolan, Oppenheimer is an epic thriller about the man who must risk destroying the world in order to save it.',
        uploaderId: movieUser._id,
        thumbnailUrl: 'https://i.ytimg.com/vi/u31fed_224s/maxresdefault.jpg',
        duration: 181,
        views: 78000000,
        likes: 1200000,
        category: 'Entertainment',
      },
      // 3. Free Music Video
      {
        youtubeVideoId: 'd9MyW72ELq0',
        title: 'Queen – Bohemian Rhapsody (Official Video)',
        description: 'REMASTERED IN HD TO CELEBRATE ONE BILLION VIEWS! Taken from A Night At The Opera, 1975.',
        uploaderId: musicUser._id,
        thumbnailUrl: 'https://i.ytimg.com/vi/d9MyW72ELq0/maxresdefault.jpg',
        duration: 367,
        views: 1700000000,
        likes: 20000000,
        category: 'Music',
      },
      // 4. Free Gaming Trailer
      {
        youtubeVideoId: '6JnN1DmbqoU',
        title: 'Dune: Part Two | Official Trailer',
        description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
        uploaderId: movieUser._id,
        thumbnailUrl: 'https://i.ytimg.com/vi/6JnN1DmbqoU/maxresdefault.jpg',
        duration: 154,
        views: 45000000,
        likes: 950000,
        category: 'Gaming',
      },
      // 5. Premium Education Documentary
      {
        youtubeVideoId: 'H_2E01yA3eI',
        title: 'A Brief History of Quantum Mechanics',
        description: 'A deep dive into the fascinating and bizarre world of quantum mechanics, from Planck to the present day. An exclusive documentary.',
        uploaderId: techUser._id,
        thumbnailUrl: 'https://i.ytimg.com/vi/H_2E01yA3eI/maxresdefault.jpg',
        duration: 3600, // 1h
        views: 5200000,
        likes: 180000,
        category: 'Education',
        monetization: { type: 'premium', price: { rent: 100, buy: 350 } }
      },
      // 6. Free Lifestyle Vlog
      {
        youtubeVideoId: 'v_pw2k1upG4',
        title: 'A Day in Tokyo, Japan',
        description: 'Exploring the vibrant streets of Shibuya, enjoying local food, and experiencing the unique culture of Tokyo.',
        uploaderId: musicUser._id,
        thumbnailUrl: 'https://i.ytimg.com/vi/v_pw2k1upG4/maxresdefault.jpg',
        duration: 905, // 15m
        views: 1200000,
        likes: 75000,
        category: 'Lifestyle',
      },
      // 7. Free Lofi Music Stream
       {
        youtubeVideoId: 'jfKfPfyJRdk',
        title: 'lofi hip hop radio - beats to relax/study to',
        description: 'A new chapter of the lofi girl story is arriving. Thank you for being a part of this journey 🧡',
        uploaderId: musicUser._id,
        thumbnailUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg',
        duration: 86400,
        views: 1500000000,
        likes: 14000000,
        category: 'Music',
      },
      // 8. Free Tech Review
      {
        youtubeVideoId: '7nwni5v_A1I',
        title: 'iPhone 16 Pro Review: The Game Changer!',
        description: 'A complete hands-on review of the latest iPhone 16 Pro, its features, camera, and performance benchmarks.',
        uploaderId: techUser._id,
        thumbnailUrl: 'https://i.ytimg.com/vi/7nwni5v_A1I/maxresdefault.jpg',
        duration: 725, // 12m
        views: 9800000,
        likes: 320000,
        category: 'Tech',
      },
      // 9. Premium Gaming Walkthrough
      {
        youtubeVideoId: 'c2p6A5gJp2A',
        title: 'Elden Ring: Full Game Walkthrough (No Commentary)',
        description: 'A complete, cinematic walkthrough of the entire Elden Ring main story. The definitive player\'s guide.',
        uploaderId: gameUser._id,
        thumbnailUrl: 'https://i.ytimg.com/vi/c2p6A5gJp2A/maxresdefault.jpg',
        duration: 32400, // 9h
        views: 11000000,
        likes: 150000,
        category: 'Gaming',
        monetization: { type: 'premium', price: { rent: 200, buy: 700 } }
      },
      // 10. Free Entertainment Short Film
      {
        youtubeVideoId: 'mP0_t-52nS8',
        title: 'Charge - A Blender Open Movie',
        description: 'Charge is the 14th open movie from Blender Studio. A story about an old robot, a battery, and a choice.',
        uploaderId: movieUser._id,
        thumbnailUrl: 'https://i.ytimg.com/vi/mP0_t-52nS8/maxresdefault.jpg',
        duration: 210,
        views: 1800000,
        likes: 120000,
        category: 'Entertainment',
      }
    ];

    await Video.insertMany(videos);
    console.log(`${videos.length} videos created.`);

    console.log("✅ Database has been successfully seeded with a rich dataset!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();