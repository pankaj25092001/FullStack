import { Response } from 'express';
import { Watchlist } from '../models/watchlist.model';
import { AuthRequest } from '../middlewares/auth.middleware';
import mongoose from 'mongoose';

export const getWatchlist = async (req: AuthRequest, res: Response) => {
    try {
        const watchlist = await Watchlist.findOne({ userId: req.user._id })
            .populate('videos', 'title thumbnailUrl category'); // Populate with needed fields
            
        if (!watchlist) {
            return res.status(200).json({ userId: req.user._id, videos: [] });
        }
        res.status(200).json(watchlist);
    } catch (error) {
        console.error("GET Watchlist Error:", error);
        res.status(500).json({ message: "Server error while fetching watchlist" });
    }
};

export const toggleWatchlist = async (req: AuthRequest, res: Response) => {
    const { videoId } = req.body;
    const userId = req.user._id;

    if (!videoId || !mongoose.isValidObjectId(videoId)) {
        return res.status(400).json({ message: "A valid videoId is required" });
    }

    try {
        let watchlist = await Watchlist.findOne({ userId });

        if (!watchlist) {
            // If watchlist doesn't exist, create it and add the video
            watchlist = await Watchlist.create({ userId, videos: [videoId] });
            return res.status(201).json({ message: "Video added to watchlist" });
        }

        const videoIndex = watchlist.videos.findIndex(id => id.toString() === videoId);

        if (videoIndex > -1) {
            // Video exists, so remove it
            watchlist.videos.splice(videoIndex, 1);
            await watchlist.save();
            res.status(200).json({ message: "Video removed from watchlist" });
        } else {
            // Video doesn't exist, so add it
            watchlist.videos.push(videoId);
            await watchlist.save();
            res.status(200).json({ message: "Video added to watchlist" });
        }
    } catch (error) {
        console.error("TOGGLE Watchlist Error:", error);
        res.status(500).json({ message: "Server error while updating watchlist" });
    }
};