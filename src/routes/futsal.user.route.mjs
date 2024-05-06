import express from "express";
const router = express.Router();

import {
  listUsers,
  getUser,
  addUser,
  loginUser,
  logoutUser,
  activateEmail,
  resetPassword,
  changePassword
} from "../controllers/futsal.user.controller.mjs";

router.get("/", listUsers);
router.get("/logout", logoutUser);
router.get("/:id", getUser)
router.post("/register", addUser);
router.post("/login", loginUser);
router.put("/activate/:id", activateEmail)
router.post("/reset-password", resetPassword)
router.post("/change-password", changePassword)

export default router;
