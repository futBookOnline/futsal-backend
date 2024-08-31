import FutsalReservation from "../models/reservation.model.mjs";
import { getIoInstance } from "../sockets/socket.handler.mjs";

// GET API: List all reservations
const listReservations = async (req, res) => {
  try {
    const reservations = await FutsalReservation.find();
    reservations.length > 0
      ? res.status(200).json(reservations)
      : res.status(404).json({ message: "No reservations" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET API: Find reservation by id
const getReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await FutsalReservation.findById(id);
    reservation
      ? res.status(200).json(reservation )
      : res.status(404).json({ message: "Reservation not found" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET API: Find All Reservations by Year
const getReservationByDate = async (req, res) => {
  const { year, month, day } = req.query;
  let query = {};
  if (year) {
    query = { "reservationDate.year": year };
    if (month) {
      query = { "reservationDate.year": year, "reservationDate.month": month };
      if (day) {
        query = {
          "reservationDate.year": year,
          "reservationDate.month": month,
          "reservationDate.day": day,
        };
      }
    }
  }
  try {
    const reservations = await FutsalReservation.find(query);
    reservations.length > 0
      ? res.status(200).json(reservations)
      : res.status(404).json({ message: "Match not found" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET API: Get All Reservation by venue
const getReservationByVenueId = async (req, res) => {
  const { venueId, year, month, day } = req.query;
  let query = {};
  if (venueId) {
    query = { venueId };
    if (year) {
      query = { venueId, "reservationDate.year": year };
      if (month) {
        query = {
          venueId,
          "reservationDate.year": year,
          "reservationDate.month": month,
        };
        if (day) {
          query = {
            venueId,
            "reservationDate.year": year,
            "reservationDate.month": month,
            "reservationDate.day": day,
          };
        }
      }
    }
  }
  try {
    const reservations = await FutsalReservation.find(query);
    console.log("RESERVATIONS: ", reservations);
    reservations.length > 0
      ? res.status(200).json( reservations )
      : res.status(404).json({ message: "Match not found" });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

// POST API: Add new reservation
const addReservation = async (req, res) => {
  const reservationObject = req.body;
  try {
    const reservation = await FutsalReservation.create(reservationObject);
    if(!reservation) return res.status(401).json({ message: "Reservation failed" });
    getIoInstance().emit("new-reservation", reservation)
    res.status(201).json(reservation)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancel Reservation
const cancelReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await FutsalReservation.findByIdAndDelete(id);
    reservation
      ? res.status(200).json(reservation)
      : res.status(301).json({ message: "Failed cancelling reservation" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  listReservations,
  getReservation,
  getReservationByDate,
  getReservationByVenueId,
  addReservation,
  cancelReservation,
};
