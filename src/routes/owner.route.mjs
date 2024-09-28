import express from "express";
const router = express.Router();
import {
  listFutsalOwners,
  getFutsalOwner,
  addFutsalOwner,
  emailExists,
  loginFutsalOwner,
  activateEmail,
  deleteFutsalOwner,
  logoutFutsalOwner,
  updateOnboardStatus,
  changePassword,
  resetPassword
} from "../controllers/owner.controller.mjs";
import { verifyToken } from "../middleware/auth.middleware.mjs";

router.get("/", verifyToken, listFutsalOwners);
router.get("/logout", logoutFutsalOwner);
router.get("/:id", getFutsalOwner);
router.post("/emailExists", emailExists)
router.post("/register", addFutsalOwner);
router.post("/login", loginFutsalOwner);
router.put("/activate/:id", activateEmail);
router.delete("/delete/:id", deleteFutsalOwner);

router.put("/onboard/:id", updateOnboardStatus);
router.put("/change-password/:id", changePassword)
router.put("/reset-password/:id", resetPassword)

export default router;
