import express from "express";
import {
  listReservations,
  getReservation,
  getReservationByDate,
  getReservationByVenueId,
  getReservationBySlotId,
  addReservation,
  cancelReservation,
  deleteAllReservations,
  updateReservation,
} from "../controllers/reservation.controller.mjs";
const router = express.Router();

router.get("/", listReservations);
router.get("/date", getReservationByDate);
router.get("/venue", getReservationByVenueId);
router.post("/slot", getReservationBySlotId);
router.get("/id/:id", getReservation);
router.put("/update/:id", updateReservation)
router.post("/create-reservation", addReservation);
router.delete("/cancel/:id", cancelReservation);
router.delete("/remove-all", deleteAllReservations)

export default router;
