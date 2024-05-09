import express from "express"
import { listReservations, getReservation, addReservation } from "../controllers/futsal.reservation.controller.mjs"
const router = express.Router()

router.get("/", listReservations)
router.get("/:id", getReservation)
router.post("/create-reservation", addReservation)
export default router