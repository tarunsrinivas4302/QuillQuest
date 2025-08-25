import { consumeFromQueue } from '../config/rbmqClient.js';
import { sendEmail } from '../services/mailer.service.js';

export const startEmailConsumer = async () => {
  await consumeFromQueue('emailQueue', async (message) => {
    await sendEmail(message);
  });
};
