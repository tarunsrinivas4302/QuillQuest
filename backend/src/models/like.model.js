import mongoose from "mongoose";
const LikeSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
} , { timestamps: true });


LikeSchema.index({ blogId: 1 });
LikeSchema.index({ userId: 1 });
LikeSchema.index({ blogId: 1, userId: 1 }, { unique: true });


const Like = mongoose.model("Like", LikeSchema);
export default Like;