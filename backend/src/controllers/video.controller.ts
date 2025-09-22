// src/controllers/video.controller.ts

import { Request, Response } from 'express';
import { Video } from '../models/video.model';
import mongoose from 'mongoose';

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