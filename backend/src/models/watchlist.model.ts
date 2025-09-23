import mongoose, { Schema } from 'mongoose';

const watchlistSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'Video',
    }]
}, { timestamps: true });

export const Watchlist = mongoose.model('Watchlist', watchlistSchema);