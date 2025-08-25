import cron from "node-cron";
import zipLogs from "../scripts/zip-dialy-logs.js";
import { deleteOldLogs } from "../scripts/cleanupOldLogs.js"

cron.schedule("0 1 * * *", () => {
  zipLogs();
});

cron.schedule("0 2 * * *", () => {
  deleteOldLogs();
})