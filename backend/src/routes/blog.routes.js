import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js"; // Ensure user is logged in
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, getBlogsByUser  , getTrendingMeta, uploadEditorImage, searchBlogs} from "../controllers/blog.controller.js";
import { upload } from "../config/img-upload-config.js";
const blogRouter = express.Router();

blogRouter.post("/", authenticateUser, upload.single("image"), createBlog); // Create Blog (Authenticated User)
blogRouter.get("/trending", getTrendingMeta); // Get's What Popular Blogs from last 30 days (Public)
blogRouter.get("/search", searchBlogs); // Fuzzy Search Blogs (Public)
blogRouter.get("/", getAllBlogs); // Get All Blogs (Public)
blogRouter.get("/:id", getBlogById); // Get Blog by ID (Public)
blogRouter.put("/:id", authenticateUser, upload.single("image"), updateBlog); // Update Blog (Only Author)
blogRouter.delete("/:id", authenticateUser, deleteBlog); // Delete Blog (Only Author)
blogRouter.get("/user/:userId", getBlogsByUser); // Get Blogs by User
blogRouter.post("/rich-content-image", upload.single("cnt-image"), uploadEditorImage); // TO Upload the Image in between the content 
export default blogRouter;
