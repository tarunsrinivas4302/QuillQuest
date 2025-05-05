import { publishToQueue } from "../config/rbmqClient.js";

export const sendEmailToQueue = async ({ to, subject, template, payload }) => {
  await publishToQueue("emailQueue", { to, subject, template, payload });
};
