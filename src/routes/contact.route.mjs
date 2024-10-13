import express from "express";
import { listEmails, listUnreadEmails, saveEmailFromContactPage, markEmailAsRead,deleteEmail, deleteAllEmails } from "../controllers/contact.controller.mjs";
const router = express.Router();

router.get("/", listEmails)
router.get("/unread", listUnreadEmails)
router.post("/add", saveEmailFromContactPage)
router.put("/mark-as-read/:id", markEmailAsRead)
router.delete("/delete/:id", deleteEmail)
router.delete("/delete-all", deleteAllEmails)

export default router;