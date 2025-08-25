import { transporter } from "../config/smtp.js";
import { getEmailTemplate } from "../utils/email.template.js";

export const sendEmail = async ({ to, subject, template, payload }) => {
  console.log(template , payload)
  const { subject: emailSubject, html } = await getEmailTemplate(template, payload);

  const info = await transporter.sendMail({
    from: '"Blog App" <no-reply@blog.com>',
    to,
    subject : subject || emailSubject,
    html,
  });

  console.log("📨 Email sent:", info.messageId);
};
