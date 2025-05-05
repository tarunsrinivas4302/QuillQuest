import { Blog } from "../models/blog.model.js";
import { blogValidationSchema } from "../validations/blog.validations.js";
import { sanitizedHtmlContent } from "../utils/sanitaze-html.js";
import dotenv from "dotenv";
import redisClient from "../config/redisClient.js";
import { handleImageUpload } from "../services/image.service.js";
import { cloudinaryConfig } from "../config/img-upload-config.js";
dotenv.config();
cloudinaryConfig();
export const createBlog = async (req, res) => {
  try {
    const { error } = blogValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const sanitizedContent = sanitizedHtmlContent(req.body.content);
    let imageUrl = "";

    if (req.file) {
      const { url, hash } = await handleImageUpload(req.file.buffer , "Blog");
      imageUrl = { url, hash };
    }

    const metaDescription =
      req.body.metaDescription || sanitizedContent.substring(0, 160);
    const metaKeywords = req.body.tags?.join(", ") || "";

    const newBlog = new Blog({
      title: req.body.title.trim(),
      content: sanitizedContent,
      category: req.body.category.trim(),
      tags: req.body.tags || [],
      image: imageUrl,
      metaDescription,
      metaKeywords,
      author: req.user.id,
    });

    await newBlog.save();
    await redisClient.flushAll();

    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadEditorImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image provided" });

    const { url } = await handleImageUpload(req.file.buffer ,  "Blog");

    res.status(201).json({ url }); // Frontend will use this URL in content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { error } = blogValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    if (req.file) {
      const { url, hash } = await handleImageUpload(req.file.buffer ,  "Blog");
      imageUrl = { url, hash };
    }
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    if (blog.author.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    const sanitizedContent = sanitizedHtmlContent(req.body.content);
    let imageUrl = blog.image;

    if (req.body.image && req.body.image !== blog.image) {
      const { url, hash } = await handleImageUpload(req.file.buffer ,  "Blog");
      imageUrl = { url, hash };
    }

    blog.title = req.body.title.trim();
    blog.content = sanitizedContent;
    blog.category = req.body.category.trim();
    blog.tags = req.body.tags || blog.tags;
    blog.image = imageUrl;
    blog.metaDescription =
      req.body.metaDescription || sanitizedContent.substring(0, 160);
    blog.metaKeywords = req.body.tags?.join(", ") || "";

    await blog.save();
    await redisClient.del(`blog:${req.params.id}`);
    await redisClient.flushAll();
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchBlogs = async (req, res) => {
  try {
    const {
      query = "",
      category,
      tags,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const cacheKey = `search:${query}:${category || "all"}:${tags || "all"}:${
      startDate || "none"
    }:${endDate || "none"}:page${page}:limit${limit}`;

    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
      return res.status(200).json(JSON.parse(cachedResult));
    }

    const mustConditions = [];

    if (category) {
      mustConditions.push({
        equals: {
          path: "category",
          value: category,
        },
      });
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(",");
      mustConditions.push({
        text: {
          query: tagArray,
          path: "tags",
        },
      });
    }

    if (startDate || endDate) {
      mustConditions.push({
        range: {
          path: "createdAt",
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      });
    }

    const searchStage = {
      $search: {
        index: "default",
        compound: {
          must: [
            {
              text: {
                query,
                path: ["title", "content", "tags"],
                fuzzy: {
                  maxEdits: 2,
                },
              },
            },
            ...mustConditions,
          ],
        },
      },
    };

    const blogs = await Blog.aggregate([
      searchStage,
      { $sort: { createdAt: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
    ]);

    await redisClient.setEx(cacheKey, 300, JSON.stringify(blogs)); // Cache for 5 minutes

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const {
      search,
      category,
      tags,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const tagArray = tags?.split(",") || [];
    const query = {};

    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { content: new RegExp(search, "i") },
      ];
    }

    if (category) query.category = category;

    if (tagArray.length > 0) query.tags = { $in: tagArray };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const cacheKey = `blogs:${search || "all"}:${category || "all"}:${
      tags || "all"
    }:page${page}:limit${limit}:from${startDate || "none"}:to${
      endDate || "none"
    }`;

    const cachedBlogs = await redisClient.get(cacheKey);
    if (cachedBlogs) {
      return res.status(200).json(JSON.parse(cachedBlogs));
    }

    const blogs = await Blog.find(query)
      .populate("author", "username email")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    await redisClient.setEx(cacheKey, 300, JSON.stringify(blogs));
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `blog:${id}`;

    const cachedBlog = await redisClient.get(cacheKey);
    if (cachedBlog) {
      return res.status(200).json(JSON.parse(cachedBlog));
    }

    const blog = await Blog.findById(id).populate("author", "username email");
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    blog.views += 1;
    await blog.save();

    await redisClient.setEx(cacheKey, 600, JSON.stringify(blog));

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    if (blog.author.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    await blog.deleteOne();
    await redisClient.del(`blog:${req.params.id}`);
    await redisClient.flushAll();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBlogsByUser = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTrendingMeta = async (req, res) => {
  try {
    const cacheKey = `trending:tags-categories`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const blogs = await Blog.find({ createdAt: { $gte: last30Days } }).populate(
      "author"
    );

    const tagFrequency = {};
    const categoryFrequency = {};

    blogs.forEach((blog) => {
      blog.tags?.forEach((tag) => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });

      // Count category
      const category = blog.category;
      if (category)
        categoryFrequency[category] = (categoryFrequency[category] || 0) + 1;
    });

    const trendingTags = Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);

    const trendingCategories = Object.entries(categoryFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat]) => cat);

    const trendingData = { trendingTags, trendingCategories, blogs };

    await redisClient.setEx(cacheKey, 600, JSON.stringify(trendingData)); // Cache for 10 mins

    res.status(200).json(trendingData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
