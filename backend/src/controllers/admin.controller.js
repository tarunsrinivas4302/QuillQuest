import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalViews = await Blog.aggregate([{ $group: { _id: null, views: { $sum: "$views" } } }]);

    res.status(200).json({
      totalBlogs,
      totalUsers,
      totalComments,
      totalViews: totalViews[0]?.views || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username email");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAnyBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted by admin" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTrendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ views: -1 }).limit(10);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
