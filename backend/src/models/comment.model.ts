import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
  videoId: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    videoId: { type: Schema.Types.ObjectId, ref: "Video", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = model<IComment>("Comment", commentSchema);
export default Comment;
