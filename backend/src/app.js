import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import { errorMiddleware, notFound } from "./middlewares/error.middleware.js";
import { connectToMongoDB } from "./config/mongo.connection.js";
import mongoSanitize from "express-mongo-sanitize";
import passport from "passport";
import "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import blogRouter from "./routes/blog.routes.js";
import mongoose, { VirtualType } from "mongoose";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import likesRouter from "./routes/like.routes.js";
import commentsRouter from "./routes/comment.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const csrfProtection = csurf({ cookie: true });

const csrfMiddleware = (req, res, next) => {
  // Only enforce CSRF protection for web-based form submissions
  const isBrowserRequest =
    req.headers["content-type"] === "application/x-www-form-urlencoded" ||
    req.headers["content-type"] === "multipart/form-data";

  if (isBrowserRequest) {
    csrfProtection(req, res, (err) => {
      if (err) {
        return res.status(403).json({ error: "Invalid CSRF Token" });
      }
      next();
    });
  } else {
    // Skip CSRF for API requests (JSON-based)
    next();
  }
};

app.use(loggerMiddleware);

if (process.env.NODE_ENV === "production") {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", process.env.APP_ORIGIN],
          styleSrc: ["'self'", process.env.APP_ORIGIN],
          imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          connectSrc: ["'self'", process.env.APP_ORIGIN],
        },
      },
    })
  );
}
app.use(
  cors({
    origin: process.env.APP_ORIGIN,
    credentials: true,
    methods: "GET, POST, DELETE ,PUT, OPTIONS",
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json({ limit: "10kb" })); // Limit request body size to 10KB
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// ✅ Move cookieParser before csrfMiddleware
app.use(cookieParser());
app.use(csrfMiddleware);

// ✅ Ensure express-mongo-sanitize does not modify immutable objects
app.use((req, res, next) => {
  req.body = mongoSanitize.sanitize(req.body);
  req.params = mongoSanitize.sanitize(req.params);
  req.sanitizedQuery = mongoSanitize.sanitize(req.query); // ✅ Store sanitized query in a new property
  next();
});

app.use((req, res, next) => {
  res.cookie("session", "secureToken", {
    httpOnly: true, // Prevent JavaScript access
    secure: true, // Only send over HTTPS
    sameSite: "strict", // Prevent CSRF attacks
  });
  next();
});

app.use(passport.initialize());

const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  statusCode: 429, // HTTP status code for rate limit exceeded
});
app.use(limiter);

// * Handling Preflight requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*"); // Specify the exact origin
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Authorization"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
  } else {
    next();
  }
});

// <-- include virtuals in `JSON.stringify()`
mongoose.set("toJSON", {
  virtuals: true, // this will convert _id to id
  transform: (doc, ret) => {
    ret.password = undefined;
    ret._id = undefined;
    ret.__v = undefined;
    return ret;
  },
});

// res.send patching middleware (use this above routes)
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    res.locals.body = body;
    return originalSend.call(this, body);
  };
  next();
});

/** Testing API Health */
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running!" });
});

// Import routes

const API_VERSION = process.env.API_VERSION || "v1";
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/blogs`, blogRouter);
app.use(`/api/${API_VERSION}/likes`, likesRouter);
app.use(`/api/${API_VERSION}/comments`, commentsRouter);


app.use(notFound);
app.use(errorMiddleware);

// Start the server and connect to MongoDB
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToMongoDB();

  if (process.env.IS_EMAIL_WORKER === "true") {
    import("./workers/email.worker.js")
      .then(() => console.log(" Email worker initialized"))
      .catch((err) => console.error(" Failed to initialize email worker", err));
  }
});
