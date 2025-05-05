export default ({userName, blogTitle , blogSlug}) => ({
    subject: `Your blog "${blog.title}" got a new like ❤️`,
    html: `
      <div style="font-family:sans-serif;">
        <p>Hey ${userName},</p>
        <p>Your blog <b>${blogTitle}</b> just received a new like!</p>
        <a href="${process.env.APP_ORIGIN}/blogs/${blogSlug}" style="background:#e91e63; padding:10px; color:white; border-radius:5px;">Check it out</a>
      </div>
    `
  });
  