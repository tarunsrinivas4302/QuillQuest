import { transporter } from "../config/smtp.js";
import { getEmailTemplate } from "../templates/email.template.js";

export const sendEmail = async ({ to, subject, template, payload }) => {
  const html = await getEmailTemplate(template, payload);

  const info = await transporter.sendMail({
    from: '"Blog App" <no-reply@blog.com>',
    to,
    subject,
    html,
  });

  console.log("📨 Email sent:", info.messageId);
};
