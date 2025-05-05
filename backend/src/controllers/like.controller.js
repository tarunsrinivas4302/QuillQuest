import Like from "../models/like.model.js";
import { Blog } from "../models/blog.model.js";
import redisClient from "../config/redisClient.js";
import { likeValidationSchema } from "../validations/like.validation.js";

export const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;

    const { error } = likeValidationSchema.validate({ blogId });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const existing = await Like.findOne({ blogId, userId: req.user.id });

    if (existing) {
      await existing.deleteOne();
      await redisClient.del(`blog:${blogId}`);
      return res.status(200).json({ liked: false });
    }

    await Like.create({ blogId, userId: req.user.id });
    await redisClient.del(`blog:${blogId}`);
    res.status(200).json({ liked: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLikesCount = async (req, res) => {
  try {
    const count = await Like.countDocuments({ blogId: req.params.blogId });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const hasUserLiked = async (req, res) => {
  try {
    const liked = await Like.exists({
      blogId: req.params.blogId,
      userId: req.user.id,
    });
    res.status(200).json({ liked: !!liked });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
