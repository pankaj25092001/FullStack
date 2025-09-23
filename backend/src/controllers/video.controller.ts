// src/controllers/video.controller.ts

import { Request, Response } from 'express';
import { Video } from '../models/video.model';
import mongoose from 'mongoose';
import { AuthRequest } from '../middlewares/auth.middleware';
// --- GET ALL VIDEOS (with filtering, sorting, etc.) ---
export const getAllVideos = async (req: Request, res: Response) => {
  try {
    const { sortBy, sortOrder, category, query, minDuration, maxDuration } = req.query;

    const filter: any = {
        visibility: 'public'
    };

    if (query) {
      filter.$text = { $search: query as string };
    }
    
    if (category) {
      filter.category = category as string;
    }

    if (minDuration || maxDuration) {
        filter.duration = {};
        if (minDuration) {
            filter.duration.$gte = Number(minDuration);
        }
        if (maxDuration) {
            filter.duration.$lte = Number(maxDuration);
        }
    }

    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const videos = await Video.find(filter).sort(sortOptions);

    return res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return res.status(500).json({ message: 'Server error while fetching videos' });
  }
};

// --- NEW: GET A SINGLE VIDEO BY ITS ID ---
export const getVideoById = async (req: Request, res: Response) => {
    try {
        const { videoId } = req.params;

        // Check if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.isValidObjectId(videoId)) {
            return res.status(400).json({ message: 'Invalid video ID format' });
        }

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // We can add logic here later to increment the view count
        
        return res.status(200).json(video);

    } catch (error) {
        console.error(`Error fetching video by ID: ${req.params.videoId}`, error);
        return res.status(500).json({ message: 'Server error while fetching video' });
    }
}
export const toggleLike = async (req: AuthRequest, res: Response) => {
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

        // Check if the user's ID is already in the likes array
        const isLiked = video.likes.includes(userId);

        if (isLiked) {
            // If they have liked it, remove their ID ($pull)
            await Video.findByIdAndUpdate(videoId, { $pull: { likes: userId } });
            // We can send back the updated like count
            const updatedVideo = await Video.findById(videoId);
            res.status(200).json({ message: "Like removed", likeCount: updatedVideo?.likes.length });
        } else {
            // If they have not liked it, add their ID ($addToSet prevents duplicates)
            await Video.findByIdAndUpdate(videoId, { $addToSet: { likes: userId } });
            const updatedVideo = await Video.findById(videoId);
            res.status(200).json({ message: "Like added", likeCount: updatedVideo?.likes.length });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error while toggling like" });
    }
}