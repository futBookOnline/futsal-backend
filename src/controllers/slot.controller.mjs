import Slot from "../models/slot.model.mjs";
import { generateSlots, generateSlotsForWeek } from "../utils/slot.utils.mjs";
import Futsal from "../models/venue.model.mjs";
import { adjustDateToNepalTimezone } from "../utils/helper.utils.mjs";

// GET API: Fetch All Slots
const listSlots = async (req, res) => {
  try {
    const slots = await Slot.find().populate({
      path: 'venueId',
      populate: {
        path: 'userId',
        select: '-password'
      }
    }) ;
    // const slots = await Slot.find().select("_id")
    slots.length < 1
      ? res.status(404).json({ message: "There are no slots." })
      : res.status(200).json(slots);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET API: Fetch Slot By Slot Id
const getSlotBySlotId = async (req, res) => {
  const { id } = req.params;
  try {
    const slot = await Slot.findById(id).populate({
      path: 'venueId',
      populate: {
        path: 'userId',
         select: '-password'
      }
    });
    slot
      ? res.status(200).json(slot)
      : res.status(404).json({ message: `No slot for ${id}` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET API: Fetch All Slots By Venue, Start Date And End Date
const listSlotsByVenue = async (req, res) => {
  const { venueId, queryStartDate, queryEndDate } = req.query;
  let query = {};
  if (venueId) {
    query = { venueId };
    if (queryStartDate) {
      const startDate = adjustDateToNepalTimezone(queryStartDate);
      query = {
        venueId,
        date: {
          $gte: startDate,
          $lte: startDate,
        },
      };
      if (queryEndDate) {
        const endDate = new Date(queryEndDate);
        query = {
          venueId,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        };
      }
    }
  }
  try {
    const slots = await Slot.find(query).populate({
      path: 'venueId',
      populate: {
        path: 'userId',
        select: '-password'
      }
    });
    slots.length < 1
      ? res.status(404).json({ message: "There are no slots." })
      : res.status(200).json(slots);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST API: Generate Slots
const addDailySlots = async (req, res) => {
  try {
    const { venueId, date } = req.body; // Example input: { "venueId": "123", "date": "2024-09-24" }
    const venue = await Futsal.findById(venueId);
    if (!venue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    const slots = await generateSlots(venue, new Date(date) );
    return res
      .status(200)
      .json({ message: "Slots generated successfully", slots });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST API: Generate Slots Weekly
const addWeeklySlots = async (req, res) => {
  try {
    const { venueId } = req.body;
    const venue = await Futsal.findById(venueId);
    if (!venue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    const slots = await generateSlotsForWeek(venue);
    return res
      .status(200)
      .json({ message: "Slots generated successfully", slots });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// PUT API: Update Slot
const updateSlot = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;
  try {
    const slot = await Slot.findById(id)
    if (!slot) return res.status(401).json({ message: "SLot does not exist." });
    const updatedSlot = await Slot.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    ).populate({
      path: 'venueId',
      populate: {
        path: 'userId',
        select: '-password'
      }
    });
    if (!updatedSlot)
      return res.status(401).json({ message: "Slot update failed." });
    res.status(200).json(updatedSlot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE API: Delete One Slot By Id
const deleteSlot = async (req, res) => {
  const { id } = req.params;
  try {
    const slot = await Slot.findByIdAndDelete(id);
    if (!slot) res.status(301).json({ message: "Failed deleting slot" });
    res.status(200).json(slot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE API: Delete Multiple Slots By Venue
const deleteMultipleSlotsByVenue = async (req, res) => {
  const { venueId, queryStartDate, queryEndDate } = req.query; // Assuming `venueId` is passed in the request body
  // if (!venueId) {
  //   return res.status(400).json({ error: "Venue ID is required" });
  // }
  let query = {};
  if(venueId){
    query = { venueId };
    if (queryStartDate) {
      const startDate = adjustDateToNepalTimezone(queryStartDate);
      query = {
        venueId,
        date: {
          $gte: startDate,
          $lte: startDate,
        },
      };
      if (queryEndDate) {
        const endDate = adjustDateToNepalTimezone(queryEndDate);
        query = {
          venueId,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        };
      }
    }
  }
  
  try {
    const result = await Slot.deleteMany(query);
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "No slots found for the provided Venue ID" });
    }
    res
      .status(200)
      .json({ message: `${result.deletedCount} slots deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  listSlots,
  getSlotBySlotId,
  listSlotsByVenue,
  addDailySlots,
  addWeeklySlots,
  updateSlot,
  deleteSlot,
  deleteMultipleSlotsByVenue,
};
