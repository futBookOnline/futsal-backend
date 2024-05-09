import FutsalReservation from "../models/futsal.reservation.model.mjs";

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

const getReservation = async (req, res) => {
    const {id} = req.params;
  try {
    const reservation = await FutsalReservation.findById(id);
    reservation
      ? res.status(200).json({ data: reservation, error: null })
      : res.status(404).json({ data: null, error: "Reservation not found" });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

export { listReservations, getReservation };
