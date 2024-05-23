import { sendEmail } from "../utils/nodeMailer.utils.mjs";

// Send Email
export const sendVerificationEmail = async (req, res) => {
  const { email, subject, message } = req.body;
  const result = await sendEmail(email, subject, message);
  result
    ? res.status(200).json({ data: result })
    : res.status(500).json({ error: "Internal Server Error" });
};
