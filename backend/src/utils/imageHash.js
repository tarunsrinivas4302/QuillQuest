// utils/imageHash.js
import crypto from "crypto";

export const generateImageHash = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};
