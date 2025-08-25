import { generateImageHash } from "../utils/imageHash.js";
import redisClient from "../config/redisClient.js";
import { Blog } from "../models/blog.model.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
export const handleImageUpload = async (buffer, type) => {
  const hash = generateImageHash(buffer);
  // redisClient.del(`image:${hash}`); // Delete the cache if it exists
  const redisUrl = await redisClient.get(`image:${hash}`);
  if (redisUrl) {
    return { url: redisUrl, hash };
  }

  // How to Find if it is from blog or not
  let existing, url;

  if (type.toLowerCase() === "blog") {
    existing = await Blog.findOne({ "image.hash": hash });
    url = existing?.image?.url;
  } else if (type.toLowerCase() === "user") {
    existing = await User.findOne({ "profileImage.hash": hash });
    url = existing?.profileImage?.url;
  }
  
  if (url) {
    await redisClient.set(`image:${hash}`, url);
    return { url, hash };
  }
  
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "blog_images",
          resource_type: "image",
          transformation: [
            { width: 800, height: 600, crop: "limit" },
            { quality: "auto:eco" },
            { fetch_format: "webp" },
          ],
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      )
      .end(buffer);
  });

  await redisClient.set(`image:${hash}`, result.secure_url);
  return { url: result.secure_url, hash };
};
