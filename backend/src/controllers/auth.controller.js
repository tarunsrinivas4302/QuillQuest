import asyncHandler from "express-async-handler";
import {
  registerUser,
  loginUser,
  refreshToken,
  resetPassword,
  forgotPassword,
  setCookie,
} from "../services/auth.service.js";
import User from "../models/user.model.js";
import { cloudinaryConfig } from "../config/img-upload-config.js";
import { handleImageUpload } from "../services/image.service.js";
import { generateAccessToken } from "../utils/generateTokens.js";

export const register = asyncHandler(async (req, res) => {
  cloudinaryConfig();
  if (req.file) {
    const { url, hash } = await handleImageUpload(req.file.buffer, "User");
    req.body.profileImage = { url, hash };
  }
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const user = await registerUser(req.body);
  if (user) {
    const token = generateAccessToken(user);
    setCookie(res, token);
    res
      .status(201)
      .json({ message: "User registered successfully", user: user });
  }
});

export const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await loginUser(req.body);
  res.json({ accessToken, refreshToken, user });
});

export const refresh = asyncHandler(async (req, res) => {
  const newToken = await refreshToken(req.body.token);
  setCookie(res, newToken);
  res.json({ accessToken: newToken });
});

export const profile = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  res.status(200).json(user);
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  await resetPassword(req, res);
  res.json({ message: "Password has been reset successfully." });
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  await forgotPassword(req, res);
  res.json({ message: "Password has been reset successfully." });
});
