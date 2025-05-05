import { consumeFromQueue } from "../config/rbmqClient.js";
import { sendEmail } from "../services/mailer.service.js";

export const startEmailWorker = async () => {
  await consumeFromQueue("emailQueue", async (data) => {
    try {
      await sendEmail(data);
    } catch (err) {
      console.error("❌ Email send failed:", err);
    }
  });
};
