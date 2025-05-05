import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, sparse: true, unique: true },
    password: { type: String, default: "" }, // Nullable for OAuth users
    // profileImage: {{ type: String , default: ''} , hash : {}}, // Nullable for OAuth users
    profileImage: {
      url: { type: String, default: "" },
      hash: { type: String, default: "",  index: { sparse: true } }, // Index for fast lookup
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    // OAuth fields
    googleId: { type: String, unique: true, sparse: true },
    githubId: { type: String, unique: true, sparse: true },

    refreshToken: { type: String },

    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

UserSchema.statics.findByIdOrEmail = async function (identifier) {
  return this.findOne({ $or: [{ _id: identifier }, { email: identifier }] });
}

const User = mongoose.model("User", UserSchema);
export default User;
