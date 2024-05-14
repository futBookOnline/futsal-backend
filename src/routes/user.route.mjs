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
  changePassword,
  updateUser,
  updateProfilePicture
} from "../controllers/user.controller.mjs";

router.get("/", listUsers);
router.get("/logout", logoutUser);
router.get("/:id", getUser)
router.post("/register", addUser);
router.post("/login", loginUser);
router.put("/activate/:id", activateEmail)
router.put("/reset-password/:id", resetPassword)
router.put("/change-password/:id", changePassword)
router.put("/update/:id", updateUser)
router.put("/upload-image/:id", updateProfilePicture)

export default router;
