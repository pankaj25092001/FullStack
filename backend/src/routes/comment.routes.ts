import express from "express";
import { protect } from "../middlewares/auth.middleware";
import { addComment, getComments, deleteComment, editComment } from "../controllers/comment.controller";

const router = express.Router();

router.post("/:videoId", protect, addComment);     // add
router.get("/:videoId", getComments);              // list
router.delete("/:commentId", protect, deleteComment); // delete
router.put("/:commentId", protect, editComment);      // edit

export default router;
