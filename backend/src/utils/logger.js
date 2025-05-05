import winston from "winston";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
};

const LOG_DIR = "logs";

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
  fs.chmodSync(LOG_DIR, "700");
}

const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

const transports = [];

if (process.env.ENABLE_FILE_LOGS === "true") {
  transports.push(
    new winston.transports.File({
      filename: path.join(LOG_DIR, `${date}-error.log`),
      level: "error"
    }),
    new winston.transports.File({
      filename: path.join(LOG_DIR, `${date}-combined.log`)
    })
  );
}

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  transports.push(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports
});

export default logger;
