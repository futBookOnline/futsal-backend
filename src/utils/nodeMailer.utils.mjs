import nodemailer from "nodemailer";
export const sendEmail = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    port: 465, 
    host: "mail.bookmyfutsal.com",
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: message,
  };
  const result =  await transporter.sendMail(mailOptions);
  return result
};
