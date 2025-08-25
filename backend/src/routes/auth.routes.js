import express from "express";
import passport from "passport";
import {
  register,
  login,
  refresh,
  profile,
  resetPasswordController,
  forgotPasswordController,
} from "../controllers/auth.controller.js";
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
} from "../validations/user.validations.js";
import validateRequest from "../middlewares/validate-request.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { upload } from "./../config/img-upload-config.js";
import { generateAccessToken } from "../utils/generateTokens.js";
import { setCookie } from "../services/auth.service.js";
const router = express.Router();

// JWT Authentication
router.post(
  "/register",
  validateRequest(registerValidation),
  upload.single("profileImage"),
  register
);
router.post("/login", validateRequest(loginValidation), login);
router.post("/refresh", validateRequest(refreshTokenValidation), refresh);
router.get("/profile", authenticateUser, profile);

// OAuth Authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateAccessToken(req.user);
    setCookie(res, token);
    const URL = process.env.FRONTEND_URL + "/auth/o-auth/google?token=" + token;
    console.log("GOOGLE URL", URL);
    res.redirect(URL);
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const token = generateAccessToken(req.user);
    setCookie(res, token);
    const URL = process.env.FRONTEND_URL + "/auth/o-auth/google?token=" + token;
    console.log("GITHUB URL", URL);
    res.redirect(URL);
  }
);

router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);

export default router;
