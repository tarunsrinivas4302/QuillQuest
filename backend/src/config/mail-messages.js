export const MAIL_MESSAGES = {
  register: function (user) {
    return {
      to: user.email,
      subject: "Welcome to InkSpire Blogging Platform",
      template: "welcomeEmail",
      payload: { username: user.username },
    };
  },
};
