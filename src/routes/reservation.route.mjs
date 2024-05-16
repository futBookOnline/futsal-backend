import express from "express";
import {
  listReservations,
  getReservation,
  getReservationByDate,
  getReservationByVenueId,
  addReservation,
  cancelReservation,
} from "../controllers/reservation.controller.mjs";
const router = express.Router();

router.get("/", listReservations);
router.get("/date", getReservationByDate);
router.get("/venue", getReservationByVenueId);
router.get("/id/:id", getReservation);
router.post("/create-reservation", addReservation);
router.delete("/cancel/:id", cancelReservation);

export default router;
