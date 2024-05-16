import express from "express"
import { getGoogleLogin, googleOAuthCallback } from "../controllers/google.auth.controller.mjs"
const router = express.Router()

router.get("/", getGoogleLogin)
router.get("/callback", googleOAuthCallback)

export default router