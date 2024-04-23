import express from "express"
const router = express.Router()

import {fetchAllFutsalsGetRequest, fetchFutsalGetRequest, addFutsalPostRequest, findNearByFutsalGetRequest} from "../controllers/futsal.controller.mjs"

router.get("/", fetchAllFutsalsGetRequest)
router.get("/location", findNearByFutsalGetRequest)
router.get("/:id", fetchFutsalGetRequest)
router.post("/add", addFutsalPostRequest)

export default router