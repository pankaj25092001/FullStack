import mongoose, { Schema } from 'mongoose';

const videoSchema = new Schema(
  {
    youtubeVideoId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    uploaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    thumbnailUrl: { type: String, required: true },
    duration: { type: Number, required: true },
    views: { type: Number, default: 0 },
    // --- THIS IS THE UPGRADE ---
    // Instead of a number, this is now an array of User IDs.
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    category: {
      type: String,
      required: true,
      enum: ["Tech", "Movie Trailer", "Webseries Clips", "Sports", "Hindi Music"],
      index: true,
    },
    visibility: { type: String, enum: ['public', 'private', 'unlisted'], default: 'public' },
    monetization: {
      type: { type: String, enum: ['free', 'premium'], default: 'free' },
      price: { rent: { type: Number, default: 0 }, buy: { type: Number, default: 0 } },
    },
  },
  { timestamps: true }
);

videoSchema.index({ title: 'text', description: 'text' });
export const Video = mongoose.model('Video', videoSchema);