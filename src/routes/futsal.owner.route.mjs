import express from "express"
const router = express.Router()
import { listFutsalOwners, addFutsalOwner, loginFutsalOwner, activateEmail, deleteFutsalOwner } from "../controllers/futsal.owner.controller.mjs"

router.get("/", listFutsalOwners)
router.post("/register", addFutsalOwner)
router.post("/login", loginFutsalOwner)
router.put("/activate/:id", activateEmail)
router.delete("/delete/:id", deleteFutsalOwner)

export default router