import { Response } from "express";
import Comment from "../models/comment.model";
import { AuthRequest } from "../middlewares/auth.middleware";

// ✅ Add a comment
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    const { videoId } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const comment = await Comment.create({
      text,
      videoId,
      userId: req.user._id, // comes from protect middleware
    });

    const populated = await comment.populate("userId", "username email");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// ✅ Get comments for a video
export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ videoId })
      .populate("userId", "username email profilePic") // return user info
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// ✅ Delete a comment (only owner)
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;

    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

// ✅ Edit a comment (only owner)
export const editComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }

    comment.text = text;
    await comment.save();

    const updated = await comment.populate("userId", "username email profilePic");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to edit comment" });
  }
};
