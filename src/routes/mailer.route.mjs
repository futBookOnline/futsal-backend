import express from "express";
const router = express.Router();
import { sendVerificationEmail } from "../controllers/mailer.controller.mjs";

router.post("/verification", sendVerificationEmail)

export default router