import mongoose from "mongoose";
import FutsalReservation from "../models/reservation.model.mjs";
import { getIoInstance } from "../sockets/socket.handler.mjs";
import { adjustDateToNepalTimezone } from "../utils/helper.utils.mjs";
import {
  addLoggedUserAsFutsalCustomer,
  addGuestUserAsFutsalCustomer,
} from "../utils/futsal.customer.utils.mjs";

// GET API: List all reservations
const listReservations = async (req, res) => {
  try {
    const reservations = await FutsalReservation.find().populate([
      {
        path: "slotId",
        populate: {
          path: "venueId",
          populate: {
            path: "userId",
            select: "-password",
          },
        },
      },
      "userId",
    ]);
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
    const reservation = await FutsalReservation.findById(id).populate([
      {
        path: "slotId",
        populate: {
          path: "venueId",
          populate: {
            path: "userId",
            select: "-password",
          },
        },
      },
      "userId",
    ]);
    reservation
      ? res.status(200).json(reservation)
      : res.status(404).json({ message: "Reservation not found" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// THIS MIGHT NOT BE USEFUL ANYMORE
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
    }).populate([
      {
        path: "slotId",
        populate: {
          path: "venueId",
          populate: {
            path: "userId",
            select: "-password",
          },
        },
      },
      "userId",
    ]);
    reservations.length > 0
      ? res.status(200).json(reservations)
      : res.status(404).json({ message: "Match not found" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// THIS MIGHT NOT BE USEFUL ANYMORE
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
    const reservations = await FutsalReservation.find(query).populate([
      {
        path: "slotId",
        populate: {
          path: "venueId",
          populate: {
            path: "userId",
            select: "-password",
          },
        },
      },
      "userId",
    ]);
    reservations.length > 0
      ? res.status(200).json(reservations)
      : res.status(404).json({ message: "Match not found" });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

//GET API: Get Reservations By Venue And Distinct Users
const getReservationByVenueAndDistinctUser = async (req, res) => {
  const { venueId } = req.params;
  console.log("VENUE ID: ", venueId);
  try {
    const reservations = await FutsalReservation.find({}).populate({
      path: "slotId",
      match: { venueId: venueId },
    }).distinct("userId");
    
    reservations.length > 0
      ? res.status(200).json(reservations)
      : res.status(404).json({ message: "Match not found" });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

// POST API: Get All Reservations by slot, reservation start date and reservation end date where slot should be an array
const getReservationBySlotId = async (req, res) => {
  let { slotIds, queryStartDate, queryEndDate } = req.body;
  slotIds = slotIds.filter((id) => mongoose.isValidObjectId(id));
  let query = {};
  let populateOptions = [];
  if (slotIds) {
    query = { slotId: { $in: slotIds } };
    let match = {};
    if (queryStartDate) {
      const startDate = adjustDateToNepalTimezone(queryStartDate);
      match.date = { $gte: startDate, $lte: startDate };
      if (queryEndDate) {
        const endDate = adjustDateToNepalTimezone(queryEndDate);
        match.date = { $gte: startDate, $lte: endDate };
      }
    }
    populateOptions.push({
      path: "slotId",
      match: Object.keys(match).length ? match : undefined, // Include match if it's not empty
      populate: {
        path: "venueId",
        populate: {
          path: "userId",
          select: "-password",
        },
      },
    });
  }
  populateOptions.push("userId");

  try {
    let reservations = await FutsalReservation.find(query).populate(
      populateOptions
    );
    // Filter out reservations where slotId is null due to unmatched dates
    reservations = reservations.filter(reservation => reservation.slotId !== null);

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
  const isLoggedUser = reservationObject.userId;
  try {
    let reservation = await FutsalReservation.create(reservationObject);
    if (!reservation)
      return res.status(401).json({ message: "Reservation failed" });
    reservation = await FutsalReservation.findById(reservation._id).populate([
      "userId",
      "slotId",
    ]);
    isLoggedUser
      ? addLoggedUserAsFutsalCustomer(
          reservation.slotId.venueId,
          reservationObject.userId
        )
      : addGuestUserAsFutsalCustomer(
          reservation.slotId.venueId,
          reservationObject.guestUser
        );
    console.log("Emitting reservation-added event with data:", reservation);
    getIoInstance().emit("reservation-added", reservation);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Registration
const updateReservation = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;
  try {
    const reservation = await FutsalReservation.findById(id);
    if (!reservation)
      return res.status(401).json({ message: "Reservation does not exist." });
    //need to check date and time and allow time update upto 30 minutes prior to reservation time only.
    const updatedReservation = await FutsalReservation.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    ).populate([
      {
        path: "slotId",
        populate: {
          path: "venueId",
          populate: {
            path: "userId",
            select: "-password",
          },
        },
      },
      "userId",
    ]);
    if (!updatedReservation)
      return res.status(401).json({ message: "Reservation update failed." });
    getIoInstance().emit("reservation-updated", updatedReservation);
    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancel Reservation By Id
const cancelReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await FutsalReservation.findByIdAndDelete(id);
    if (!reservation)
      res.status(301).json({ message: "Failed cancelling reservation" });
    getIoInstance().emit("reservation-cancelled", reservation);
    res.status(200).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove All Reservations
const deleteAllReservations = async (req, res) => {
  try {
    const result = await FutsalReservation.deleteMany({}); // Empty filter to delete all documents
    res.status(200).json({
      message: `${result.deletedCount} reservations deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  listReservations,
  getReservation,
  getReservationByDate,
  getReservationByVenueId,
  getReservationByVenueAndDistinctUser,
  getReservationBySlotId,
  addReservation,
  updateReservation,
  cancelReservation,
  deleteAllReservations,
};
