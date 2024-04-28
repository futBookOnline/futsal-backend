import express from "express"
const router = express.Router()

import {listFutsals, getFutsal, addFutsal, listNearbyFutsals} from "../controllers/futsal.controller.mjs"

router.get("/", listFutsals)
router.get("/location", listNearbyFutsals)
router.get("/:id", getFutsal)
router.post("/add", addFutsal)

export default router