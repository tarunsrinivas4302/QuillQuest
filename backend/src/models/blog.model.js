import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    category: { type: String, required: true },
    // image: { type: String }, // Store image URL (from S3/Cloudinary)
    image: {
      url: { type: String, required: true },
      hash: { type: String, required: true, index: true }, // Index for fast lookup
    },
    isPublished: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Like functionality

    // For SEO purposes
    tags: [{ type: String }], // Optional: For filtering
    metaTitle: { type: String }, // Auto-generated Meta Title
    metaDescription: { type: String }, // Auto-generated Meta Description
    metaKeywords: [{ type: String }], // Auto-generated Keywords
  },
  { timestamps: true }
);


BlogSchema.pre("save", function (next) {
  if (!this.metaTitle) this.metaTitle = this.title;
  if (!this.metaDescription) this.metaDescription = this.content.substring(0, 150);
  if (!this.metaKeywords || this.metaKeywords.length === 0) {
    this.metaKeywords = extractKeywords(this.content);
  }
  next();
});

export const Blog = mongoose.model("Blog", BlogSchema);
