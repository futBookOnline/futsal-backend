import express from "express";
import {
  listReservations,
  getReservation,
  getReservationByDate,
  getReservationByVenueId,
  getReservationByVenueAndDistinctUser,
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
router.get("/venue/distinct-user/:userId", getReservationByVenueAndDistinctUser);
router.post("/slot", getReservationBySlotId);
router.get("/id/:id", getReservation);
router.put("/update/:id", updateReservation)
router.post("/create-reservation", addReservation);
router.delete("/cancel/:id", cancelReservation);
router.delete("/remove-all", deleteAllReservations)

export default router;
