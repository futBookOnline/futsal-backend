import FutsalReservation from "../models/reservation.model.mjs";
import { getIoInstance } from "../sockets/socket.handler.mjs";
import { adjustDateToNepalTimezone } from "../utils/helper.utils.mjs";

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
      ? res.status(200).json(reservation)
      : res.status(404).json({ message: "Reservation not found" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET API: Find All Reservations by Date
const getReservationByDate = async (req, res) => {
  const { queryStartDate, queryEndDate } = req.query;
  const startDate = new Date(queryStartDate);
  let endDate = new Date(startDate);
  if (queryEndDate) {
    endDate = new Date(queryEndDate);
  }
  try {
    const reservations = await FutsalReservation.find({
      reservationDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    reservations.length > 0
      ? res.status(200).json(reservations)
      : res.status(404).json({ message: "Match not found" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET API: Get All Reservations by venue, reservation start date and reservation end date
const getReservationByVenueId = async (req, res) => {
  const { venueId, queryStartDate, queryEndDate } = req.params;
  let query = {};
  let startDate = new Date();
  let endDate = new Date();
  if (venueId) {
    query = { venueId };
    if (queryStartDate) {
      startDate = new Date(queryStartDate);
      query = {
        venueId,
        reservationDate: {
          $gte: startDate,
          $lte: endDate,
        },
      };
      if (queryEndDate) {
        endDate = new Date(queryEndDate);
        query = {
          venueId,
          reservationDate: {
            $gte: startDate,
            $lte: endDate,
          },
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
    res.status(400).json({ message: "Something went wrong" });
  }
};


// POST API: Get All Reservations by slot, reservation start date and reservation end date
const getReservationBySlotId = async (req, res) => {
  let  { slotIds, queryStartDate, queryEndDate } = req.body;
  let query = {};
  if (slotIds) {
    query = { slotId: {$in: slotIds} };
    if (queryStartDate) {
      const startDate = adjustDateToNepalTimezone(queryStartDate);
      query = {
        slotIds,
        reservationDate: {
          $gte: startDate,
          $lte: startDate,
        },
      };
      if (queryEndDate) {
        const endDate = adjustDateToNepalTimezone(queryEndDate);
        query = {
          slotIds,
          reservationDate: {
            $gte: startDate,
            $lte: endDate,
          },
        };
      }
    }
  }
 
  try {
    const reservations = await FutsalReservation.find(query);
    reservations.length > 0
      ? res.status(200).json(reservations)
      : res.status(404).json({ message: "Reservation not found" });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

// POST API: Add new reservation
const addReservation = async (req, res) => {
  const reservationObject = req.body;
  console.log("FORM DATA: ", reservationObject)
  try {
    const reservation = await FutsalReservation.create(reservationObject);
    if (!reservation)
      return res.status(401).json({ message: "Reservation failed" });
    getIoInstance().emit("reservation-added", reservation);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Registration
const updateReservation = async(req, res) => {
  const {id} = req.params
  const updateFields = req.body;
  try {
    const reservation = await FutsalReservation.findById(id)
    if(!reservation)
      return res.status(401).json({ message: "Reservation does not exist." });
    //need to check date and time and allow time update upto 30 minutes prior to reservation time only.
    const updatedReservation = await FutsalReservation.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );
    if (!updatedReservation)
      return res.status(401).json({ message: "Reservation update failed." });
    getIoInstance().emit("reservation-updated", updatedReservation);
    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Cancel Reservation By Id
const cancelReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await FutsalReservation.findByIdAndDelete(id);
    if(!reservation)
      res.status(301).json({ message: "Failed cancelling reservation" });
    getIoInstance().emit("reservation-cancelled", reservation);
    res.status(200).json(reservation)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove All Reservations
const deleteAllReservations = async (req, res) => {
  try {
    const result = await FutsalReservation.deleteMany({}); // Empty filter to delete all documents
    res.status(200).json({ message: `${result.deletedCount} reservations deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  listReservations,
  getReservation,
  getReservationByDate,
  getReservationByVenueId,
  getReservationBySlotId,
  addReservation,
  updateReservation,
  cancelReservation,
  deleteAllReservations
};
