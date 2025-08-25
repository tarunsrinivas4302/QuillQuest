// routes/comment.routes.js
import express from "express";
import {
  addComment,
  getCommentsByBlog,
  deleteComment,
} from "../controllers/comment.controller.js";
import { rateLimiter } from "../middlewares/rate-limiter.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:blogId", authenticateUser, rateLimiter(10, 60), addComment); // 10 comments per 60s
router.get("/:blogId", getCommentsByBlog);
router.delete("/:commentId", authenticateUser, deleteComment);

export default router;
