import express from "express";
const router = express.Router();
import {
  listFutsalOwners,
  addFutsalOwner,
  loginFutsalOwner,
  activateEmail,
  deleteFutsalOwner,
  logoutFutsalOwner,
  changePassword,
  resetPassword
} from "../controllers/futsal.owner.controller.mjs";

router.get("/", listFutsalOwners);
router.post("/register", addFutsalOwner);
router.post("/login", loginFutsalOwner);
router.put("/activate/:id", activateEmail);
router.delete("/delete/:id", deleteFutsalOwner);
router.get("/logout", logoutFutsalOwner);
router.post("/change-password", changePassword)
router.post("/reset-password", resetPassword)

export default router;
