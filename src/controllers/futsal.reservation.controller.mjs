import FutsalReservation from "../models/futsal.reservation.model.mjs";

// GET API: List all reservations
const listReservations = async (req, res) => {
  try {
    const reservations = await FutsalReservation.find();
    reservations.length > 0
      ? res.status(200).json({ data: reservations, error: null })
      : res.status(404).json({ data: null, error: "No reservations" });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// GET API: Find reservation by id
const getReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await FutsalReservation.findById(id);
    reservation
      ? res.status(200).json({ data: reservation, error: null })
      : res.status(404).json({ data: null, error: "Reservation not found" });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// POST API: Add new reservation
const addReservation = async (req, res) => {
  const reservationObject = req.body;
  try {
    const reservation = await FutsalReservation.create(reservationObject);
    reservation
      ? res.status(201).json({ data: reservation, error: null })
      : res.status(401).json({ data: null, error: "Reservation failed" });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

export { listReservations, getReservation, addReservation };
