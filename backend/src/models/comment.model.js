import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // For nested comments
},  { timestamps: true });

CommentSchema.index({ blogId: 1 });
CommentSchema.index({ userId: 1 });
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ blogId: 1, userId: 1 });
CommentSchema.index({ blogId: 1, parentComment: 1 });
CommentSchema.index({ userId: 1, parentComment: 1 });
const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
