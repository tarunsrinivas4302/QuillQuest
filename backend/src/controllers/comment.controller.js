import Comment from "../models/comment.model.js";
import { Blog } from "../models/blog.model.js";
import redisClient from "../config/redisClient.js";
import { commentValidationSchema } from "../validations/comment.validation.js";

export const addComment = async (req, res) => {
  try {
    const { content, parentComment } = req.body;
    const { blogId } = req.params;

    const { error } = commentValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // if (!content) return res.status(400).json({ error: "Content is required" });

    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent)
        return res.status(404).json({ error: "Parent comment not found" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const comment = await Comment.create({
      blogId,
      userId: req.user.id,
      content,
      parentComment: parentComment || null,
    });

    await redisClient.del(`blog:${blogId}`); // Optional: Invalidate blog cache

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const cacheKey = `comments:${blogId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    // Fetch all comments for the blog
    const allComments = await Comment.find({ blogId })
      .populate("userId", "username")
      .sort({ createdAt: 1 });

    // Group comments by parent
    const commentMap = {};
    const rootComments = [];

    allComments.forEach((comment) => {
      const c = comment.toObject();
      c.replies = [];
      commentMap[c._id] = c;

      // if (!c.parentComment) {
      //   rootComments.push(c);
      // } else {
      //   commentMap[c.parentComment]?.replies.push(c);
      // }
      if (commentMap[c.parentComment]) {
        commentMap[c.parentComment].replies.push(c);
      } else {
        rootComments.push(c); // fallback to root if orphaned
      }
    });

    await redisClient.setEx(cacheKey, 300, JSON.stringify(rootComments)); // Cache for 5 mins
    res.status(200).json(rootComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    await comment.deleteOne();
    await redisClient.del(`blog:${comment.blogId}`);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
