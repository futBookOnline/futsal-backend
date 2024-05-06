import express from "express"
const router = express.Router()
import { listFutsalOwners, addFutsalOwner, loginFutsalOwner, deleteFutsalOwner } from "../controllers/futsal.owner.controller.mjs"

router.get("/", listFutsalOwners)
router.post("/register", addFutsalOwner)
router.post("/login", loginFutsalOwner)
router.delete("/delete/:id", deleteFutsalOwner)

export default router