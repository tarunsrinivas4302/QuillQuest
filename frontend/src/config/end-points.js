export const API_ENDPOINTS = {
  // * AUTH END POINTS
  userLogin: { url: "/auth/login", method: "POST" },
  userSignup: { url: "/auth/register", method: "POST" },
  googleLogin: { url: "/auth/google", method: "GET" },
  githubLogin: { url: "/auth/github", method: "GET" },
  userProfile: { url: "/auth/profile", method: "POST" },
  refreshToken: { url: "/auth/refresh", method: "POST" },
  forgotPassword: { url: "/auth/forgot-password", method: "POST" },
  resetPassword: { url: "/auth/reset-password", method: "POST" },
  fetchProfile: { url: "/auth/profile", method: "GET" },
  // * BLOG END POINTS
  trendingBlogs: { url: "/blogs/trending", method: "GET" },
  uploadBlog: { url: "/blogs/", method: "POST" },
  getAllBlogs: { url: "/blogs/", method: "GET" },
  searchBlog: { url: "/blogs/search", method: "GET" },
  updateBlog: { url: "/blogs/", method: "PUT", params: "id" }, // BlogID
  deleteBlog: { url: "/blogs/", method: "DELETE", params: "id" }, // BlogID
  userBlog: { url: "/blogs/", method: "", params: "userId" }, // userID

  // * Upload Images
  uploadImage: { url: "/blogs/rich-content-image", method: "POST" },
};
