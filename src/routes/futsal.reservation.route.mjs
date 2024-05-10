import express from "express";
import {
  listReservations,
  getReservation,
  addReservation,
  cancelReservation,
} from "../controllers/futsal.reservation.controller.mjs";
const router = express.Router();

router.get("/", listReservations);
router.get("/:id", getReservation);
router.post("/create-reservation", addReservation);
router.delete("/cancel/:id", cancelReservation);

export default router;
