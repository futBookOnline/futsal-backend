import express from "express";
const router = express.Router();

import {
  fetchAllUsersGetRequest,
  addUserPostRequest,
  loginUserPostRequest,
  logOutUserGetRequest,
  activateEmailPostRequest,
} from "../controllers/user.controller.mjs";

router.get("/", fetchAllUsersGetRequest);
router.post("/register", addUserPostRequest);
router.post("/login", loginUserPostRequest);
router.get("/logout", logOutUserGetRequest);
router.put("/:id", activateEmailPostRequest)

export default router;
