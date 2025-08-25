import express from "express";
import {
  getAdminAnalytics,
  getAllUsers,
  getAllBlogs,
  deleteAnyBlog,
  getTrendingBlogs,
} from "../controllers/admin.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.use(isAuthenticated, isAdmin);

router.get("/analytics", getAdminAnalytics);
router.get("/users", getAllUsers);
router.get("/blogs", getAllBlogs);
router.get("/blogs/trending", getTrendingBlogs);
router.delete("/blogs/:id", deleteAnyBlog);

export default router;
