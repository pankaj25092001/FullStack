import { Response } from 'express';
import { Video } from '../models/video.model';
import { AuthRequest } from '../middlewares/auth.middleware';

// A robust helper function to extract the Video ID from any valid YouTube URL
const getYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
};

export const submitVideoByUrl = async (req: AuthRequest, res: Response) => {
    const { url, title, description, category, price } = req.body;
    const uploaderId = req.user._id;

    if (!url || !title || !description || !category || !price) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const youtubeVideoId = getYouTubeVideoId(url);
    if (!youtubeVideoId) {
        return res.status(400).json({ message: "Invalid YouTube URL provided." });
    }

    try {
        const existingVideo = await Video.findOne({ youtubeVideoId });
        if (existingVideo) {
            return res.status(409).json({ message: "This YouTube video has already been added to our platform." });
        }

        const newVideo = await Video.create({
            youtubeVideoId,
            title,
            description,
            category,
            uploaderId,
            thumbnailUrl: `https://i.ytimg.com/vi/${youtubeVideoId}/maxresdefault.jpg`,
            duration: 0, // Default duration, can be updated later
            monetization: {
                type: 'premium',
                price: {
                    rent: Math.max(49, Math.floor(price * 0.4)),
                    buy: price
                }
            }
        });

        res.status(201).json({ message: "Video added successfully!", video: newVideo });

    } catch (error) {
        console.error("Error submitting video by URL:", error);
        res.status(500).json({ message: "Server error while adding video." });
    }
};