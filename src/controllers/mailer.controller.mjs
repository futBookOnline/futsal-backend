import { sendEmail } from "../utils/nodeMailer.utils.mjs";
const { randomInt } = await import("node:crypto");

// POST API: Send Email Verification
const sendVerificationEmail = async (req, res) => {
  const verificationCode = randomInt(100000, 1000000);
  const { email, subject } = req.body;
  const message = `Your verification code: ${verificationCode}`;
  const result = await sendEmail(email, subject, message);
  result.verificationCode = verificationCode;
  result
    ? res.status(200).json(result)
    : res.status(500).json({ message: "Internal Server Error" });
};



export { sendVerificationEmail };
