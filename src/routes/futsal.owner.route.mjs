import express from "express"
const router = express.Router()
import { listFutsalOwners, addFutsalOwner, deleteFutsalOwner } from "../controllers/futsal.owner.controller.mjs"

router.get("/", listFutsalOwners)
router.post("/register", addFutsalOwner)
router.delete("/delete/:id", deleteFutsalOwner)

export default router