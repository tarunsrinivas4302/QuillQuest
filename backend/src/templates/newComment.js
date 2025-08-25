export default ({ blogTitle, blogSlug, commentAuthor, commentContent }) => ({
  subject: `New comment on your blog "${blogTitle}"`,
  html: `
      <div style="font-family:sans-serif;">
        <p><b>${commentAuthor}</b> commented on your blog:</p>
        <blockquote>"${commentContent}"</blockquote>
        <a href="${process.env.APP_ORIGIN}/blogs/${blogSlug}" style="background:#FF9800; color:white; padding:10px; border-radius:5px;">View Comment</a>
      </div>
    `,
});
