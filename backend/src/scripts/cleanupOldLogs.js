// scripts/cleanupOldLogs.js
import fs from 'fs';
import path from 'path';

const logsDir = path.resolve('logs');
const daysToKeep = 7;

export const deleteOldLogs = () => {
  const now = Date.now();

  fs.readdir(logsDir, (err, files) => {
    if (err) return console.error('Failed to read logs directory:', err);

    files.forEach((file) => {
      const filePath = path.join(logsDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return console.error(`Error reading ${file}:`, err);

        const fileAgeInMs = now - stats.mtimeMs;
        const daysOld = fileAgeInMs / (1000 * 60 * 60 * 24);

        if (daysOld > daysToKeep) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Failed to delete ${file}:`, err);
            } else {
              console.log(`🧹 Deleted old log file: ${file}`);
            }
          });
        }
      });
    });
  });
};

// deleteOldLogs();
