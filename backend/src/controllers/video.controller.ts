// src/controllers/video.controller.ts

import { Request, Response } from 'express';
import { Video } from '../models/video.model';
import mongoose from 'mongoose';
import { AuthRequest } from '../middlewares/auth.middleware';

// --- UPGRADED: GET ALL VIDEOS (with Pagination) ---
export const getAllVideos = async (req: Request, res: Response) => {
  try {
    // --- Pagination Parameters ---
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) ||12; // Default to 8 videos per page
    const skip = (page - 1) * limit;

    // --- Filtering and Sorting Parameters (Unchanged) ---
    const { sortBy, sortOrder, category, query, minDuration, maxDuration } = req.query;

    const filter: any = { visibility: 'public' };
    if (query) { filter.$text = { $search: query as string }; }
    if (category && category !== "All") { filter.category = category as string; }
    if (minDuration || maxDuration) {
      filter.duration = {};
      if (minDuration) { filter.duration.$gte = Number(minDuration); }
      if (maxDuration) { filter.duration.$lte = Number(maxDuration); }
    }
    
    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    // --- More Efficient Database Query ---
    // Run two queries simultaneously: one for the page's videos and one for the total count
    const [videos, totalVideos] = await Promise.all([
        Video.find(filter)
             .sort(sortOptions)
             .skip(skip)
             .limit(limit),
        Video.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalVideos / limit);

    // --- New Paginated Response Structure ---
    return res.status(200).json({
        videos,
        currentPage: page,
        totalPages,
        totalVideos,
        hasNextPage: page < totalPages
    });

  } catch (error) {
    console.error('Error fetching videos:', error);
    return res.status(500).json({ message: 'Server error while fetching videos' });
  }
};

// --- Other functions (getVideoById, toggleLike) are unchanged ---
export const getVideoById = async (req: Request, res: Response) => {
    // ... same as your existing code
    try {
        const { videoId } = req.params;
        if (!mongoose.isValidObjectId(videoId)) {
            return res.status(400).json({ message: 'Invalid video ID format' });
        }
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        return res.status(200).json(video);
    } catch (error) {
        console.error(`Error fetching video by ID: ${req.params.videoId}`, error);
        return res.status(500).json({ message: 'Server error while fetching video' });
    }
};

export const toggleLike = async (req: AuthRequest, res: Response) => {
    // ... same as your existing code
    const { videoId } = req.params;
    const userId = req.user._id;
    if (!mongoose.isValidObjectId(videoId)) {
        return res.status(400).json({ message: 'Invalid video ID' });
    }
    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        const isLiked = video.likes.includes(userId);
        if (isLiked) {
            await Video.findByIdAndUpdate(videoId, { $pull: { likes: userId } });
            const updatedVideo = await Video.findById(videoId);
            res.status(200).json({ message: "Like removed", likeCount: updatedVideo?.likes.length });
        } else {
            await Video.findByIdAndUpdate(videoId, { $addToSet: { likes: userId } });
            const updatedVideo = await Video.findById(videoId);
            res.status(200).json({ message: "Like added", likeCount: updatedVideo?.likes.length });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error while toggling like" });
    }
};