import nodemailer from 'nodemailer';

// export const transporter = nodemailer.createTransport({
//   host: 'smtp-relay.brevo.com',
//   port: 587,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });


export const transporter = nodemailer.createTransport({
  service : "gmail",
  auth : {
    user : "tarun.srinivas4302@gmail.com",
    pass : "pwpcmbfmalzdwybq"
  },
})