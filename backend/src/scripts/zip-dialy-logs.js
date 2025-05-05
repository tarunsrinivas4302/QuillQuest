// scripts/zipLogs.js
import fs from 'fs';
import path from 'path';
import { createGzip } from 'zlib';
import { pipeline } from 'stream';
import { promisify } from 'util';
import dayjs from 'dayjs';

const pipe = promisify(pipeline);
const LOG_DIR = path.join(process.cwd(), 'logs');

export const zipLogs = async () => {
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

  const files = fs.readdirSync(LOG_DIR).filter((file) => {
    return file.startsWith(yesterday) && file.endsWith('.log');
  });

  for (const file of files) {
    const logPath = path.join(LOG_DIR, file);
    const zipPath = logPath + '.gz';

    try {
      await pipe(
        fs.createReadStream(logPath),
        createGzip(),
        fs.createWriteStream(zipPath)
      );

      // Remove original log after zipping
      fs.unlinkSync(logPath);
      console.log(`Zipped and removed ${file}`);
    } catch (err) {
      console.error(`Error zipping ${file}:`, err);
    }
  }
};

// zipLogs();
