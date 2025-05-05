export default ({ username, resetURL }) => `
  <div style="font-family:Arial;padding:20px">
    <h2>Hi ${username},</h2>
    <p>We received a request to reset your password.</p>
    <p><a href="${resetURL}" style="color:#1e90ff">Click here to reset your password</a></p>
    <p>This link will expire in 15 minutes.</p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <br>
    <p>– Blog Team</p>
  </div>
`;
