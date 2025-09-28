import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; // 1. Import dotenv

// THE FIX #1: Load the environment variables before any tests run
dotenv.config({ path: './.env' });

import { User } from '../models/user.model';
import { Video } from '../models/video.model';

// Increase the timeout for this test suite to 30 seconds
jest.setTimeout(30000);

describe('Video Routes', () => {
  let mongoServer: MongoMemoryServer;
  let testUser: any;
  let authToken: string;
  let videoTech: any;
  let videoGaming: any;
  let videoPrivate: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    testUser = await User.create({ 
        username: 'testuser', email: 'test@example.com', password: 'password123' 
    });

    // This will now work because the ACCESS_TOKEN_SECRET is loaded
    authToken = jwt.sign({ _id: testUser._id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' });

    videoTech = await Video.create({
        youtubeVideoId: 'tech1', title: 'Awesome Tech Video', description: 'A video about coding.',
        uploaderId: testUser._id, thumbnailUrl: 'url1', duration: 300, category: 'Tech',
        views: 1000, visibility: 'public'
    });
    videoGaming = await Video.create({
        youtubeVideoId: 'game1', title: 'Epic Gaming Moments', description: 'A video about games.',
        uploaderId: testUser._id, thumbnailUrl: 'url2', duration: 600, category: 'Tech',
        views: 5000, visibility: 'public'
    });
    videoPrivate = await Video.create({
        youtubeVideoId: 'private1', title: 'A Private Video', description: 'You should not see this.',
        uploaderId: testUser._id, thumbnailUrl: 'url3', duration: 120, category: 'Tech',
        views: 10, visibility: 'private'
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  // --- TEST GROUP #1: Get All Videos ---
  describe('GET /api/v1/videos', () => {
    it('should get all PUBLIC videos', async () => {
      const res = await request(app).get('/api/v1/videos');
      expect(res.status).toBe(200);
      expect(res.body.videos.length).toBe(2);
    });
    // ... other tests ...
  });

  // --- TEST GROUP #3: Toggle a Like (Protected Route) ---
  describe('POST /api/v1/videos/:videoId/toggle-like', () => {
    it('should fail with 401 if user is not authenticated', async () => {
      const res = await request(app).post(`/api/v1/videos/${videoTech._id}/toggle-like`);
      expect(res.status).toBe(401);
    });

    it('should add a like to a video if user is authenticated', async () => {
        const res = await request(app)
            .post(`/api/v1/videos/${videoTech._id}/toggle-like`)
            .set('Cookie', [`accessToken=${authToken}`]); // Use the generated token
        
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Like added');
        expect(res.body.likeCount).toBe(1);
    });
    // ... other tests ...
  });
});

