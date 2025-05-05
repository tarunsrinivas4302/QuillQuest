import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/generateTokens.js";
import crypto from "crypto";
import { sendEmailToQueue } from "../queues/email.publisher.js";

export const registerUser = async ({
    username,
    email,
    password,
    profileImage,
}) => {
    console.log("registerUser", username, email, password , profileImage);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        email,
        password: hashedPassword,
        profileImage,
    });
    await user.save();
    return user;
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken, user };
};

export const refreshToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== token) throw new Error("Invalid token");

        const newAccessToken = generateAccessToken(user);
        return newAccessToken;
    } catch (err) {
        throw new Error("Unauthorized");
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No user found." });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await sendEmailToQueue({
        to: user.email,
        subject: "Reset Password",
        template: "resetPassword",
        payload: { username: user.username, resetURL },
    });

    res.json({ message: "Reset link sent to your email." });
};

export const resetPassword = async (req, res) => {
    try {
        const token = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user)
            return res.status(400).json({ message: "Token is invalid or expired." });

        const { password } = req.body;
        user.password = await bcrypt.hash(password, 12);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export const setCookie = (res , token ) => {
    res.cookie("accessToken", token, {
        httpOnly: true, // Prevent JavaScript access
        secure: process.env.NODE_ENV === "production", // Only send over HTTPS
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 day
    });
}