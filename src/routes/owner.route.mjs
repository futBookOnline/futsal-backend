import express from "express";
const router = express.Router();
import {
  listFutsalOwners,
  addFutsalOwner,
  emailExists,
  loginFutsalOwner,
  activateEmail,
  deleteFutsalOwner,
  logoutFutsalOwner,
  changePassword,
  resetPassword
} from "../controllers/owner.controller.mjs";
import { verifyToken } from "../middleware/auth.middleware.mjs";

router.get("/", verifyToken, listFutsalOwners);
router.post("/emailExists", emailExists)
router.post("/register", addFutsalOwner);
router.post("/login", loginFutsalOwner);
router.put("/activate/:id", activateEmail);
router.delete("/delete/:id", deleteFutsalOwner);
router.get("/logout", logoutFutsalOwner);
router.put("/change-password", changePassword)
router.put("/reset-password", resetPassword)

export default router;
