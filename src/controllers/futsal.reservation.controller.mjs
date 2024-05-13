import FutsalReservation from "../models/futsal.reservation.model.mjs";

// GET API: List all reservations
const listReservations = async (req, res) => {
  try {
    const reservations = await FutsalReservation.find();
    reservations.length > 0
      ? res.status(200).json({ data: reservations })
      : res.status(404).json({ error: "No reservations" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET API: Find reservation by id
const getReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await FutsalReservation.findById(id);
    reservation
      ? res.status(200).json({ data: reservation })
      : res.status(404).json({ error: "Reservation not found" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POST API: Add new reservation
const addReservation = async (req, res) => {
  const reservationObject = req.body;
  try {
    const reservation = await FutsalReservation.create(reservationObject);
    reservation
      ? res.status(201).json({ data: reservation })
      : res.status(401).json({ error: "Reservation failed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cancel Reservation
const cancelReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await FutsalReservation.findByIdAndDelete(id);
    reservation
      ? res.status(200).json({ data: reservation })
      : res.status(301).json({ error: "Failed cancelling reservation" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { listReservations, getReservation, addReservation, cancelReservation };