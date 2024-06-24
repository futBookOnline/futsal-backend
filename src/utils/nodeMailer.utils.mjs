import nodemailer from "nodemailer";
export const sendEmail = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    port: 465, 
    host: "mail.bookmyfutsal.com",
    secure: true,
    auth: {
      user: process.env.NO_REPLY_EMAIL,
      pass: process.env.NO_REPLY_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.NO_REPLY_EMAIL,
    to: email,
    subject: subject,
    text: message,
  };
  const result =  await transporter.sendMail(mailOptions);
  return result
};
