import express from "express"
import { listReservations, getReservation } from "../controllers/futsal.reservation.controller.mjs"
const router = express.Router()

router.get("/", listReservations)
router.get("/:id", getReservation)
export default router