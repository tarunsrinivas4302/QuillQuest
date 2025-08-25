export default ({blogTitle , userName , blogSlug}) => ({
    subject: `Your blog "${blogTitle}" is live!`,
    html: `
      <div style="font-family:sans-serif;">
        <h2>🎉 Congrats ${userName}!</h2>
        <p>Your blog <b>${blogTitle}</b> has been successfully published.</p>
        <a href="${process.env.APP_ORIGIN}/blogs/${blogSlug}" style="background:#2196F3; padding:10px 20px; color:white; border-radius:5px;">Read Blog</a>
      </div>
    `
  });
  