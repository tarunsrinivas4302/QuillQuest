import express from "express";
import {
  toggleLike,
  getLikesCount,
  hasUserLiked,
} from "../controllers/like.controller.js";
import { rateLimiter } from "../middlewares/rate-limiter.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:blogId", authenticateUser, rateLimiter(20, 60), toggleLike);
router.delete("/:blogId", authenticateUser, toggleLike);
router.get("/count/:blogId", getLikesCount);
router.get("/has-liked/:blogId", authenticateUser, hasUserLiked);

export default router;
