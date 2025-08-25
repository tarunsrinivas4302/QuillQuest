export default(payload) => ({
    subject: `Welcome to ${process.env.APP_NAME}!`,
    html: `
      <div style="font-family:sans-serif;">
        <h1>Welcome, ${payload.username} 🎉</h1>
        <p>Thanks for joining <b>${process.env.APP_NAME}</b>. We're excited to have you!</p>
        <a href="${process.env.APP_ORIGIN}" style="color:white; background:#4CAF50; padding:10px 20px; border-radius:5px;">Visit our site</a>
      </div>
    `
  });
  