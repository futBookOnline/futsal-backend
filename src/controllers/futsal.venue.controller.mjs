import Futsal from "../models/futsal.venue.model.mjs";
import paginatedResult from "../utils/pagination.utils.mjs";

// GET API: Fetch all futsals
const listFutsals = async (req, res) => {
  try {
    const futsals = await Futsal.find();
    futsals.length < 1
      ? res
          .status(404)
          .json({ data: null, error: "There are no futsals nearby." })
      : res.status(200).json({ data: futsals, error: null });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// GET API: Fetch All Futsals With Pagination
const listPaginatedFutsals = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const futsals = await paginatedResult(Futsal, page, limit);
    futsals
      ? res.status(200).json({ data: futsals, error: null })
      : res.status(404).json({ data: null, error: "Futsal List is empty" });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// GET API: Fetch One Futsal By Id
const getFutsal = async (req, res) => {
  try {
    const futsal = await Futsal.findById(req.params.id);
    futsal
      ? res.status(200).json({ data: futsal, error: null })
      : res.status(404).json({ data: null, error: "Futsal Not Found" });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// GET API: Find Nearby Futsals
const listNearbyFutsals = async (req, res) => {
  const { longitude, latitude } = req.query;
  const radiusInKiloMeters = 5;
  try {
    const futsals = await Futsal.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInKiloMeters / 6371],
        },
      },
    });
    futsals.length > 0
      ? res.status(200).json({ data: futsals, error: null })
      : res.status(404).json({ data: null, error: "No Futsals Nearby" });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// POST API: Add New Futsal
const addFutsal = async (req, res) => {
  const { name, userId, address, location, contact } = req.body;
  try {
    const futsal = await Futsal.create({
      name,
      userId,
      address,
      location,
      contact,
    });
    futsal
      ? res.status(201).json({ data: futsal, error: null })
      : res
          .status(400)
          .json({ data: null, error: "Could not add new futsal." });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// Update Futsal Profile
const updateFutsal = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;
  try {
    const updatedFutsal = await Futsal.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );
    if (!updatedFutsal)
      return res
        .status(401)
        .json({ data: null, error: "Could not update futsal" });
    res.status(200).json({ data: updatedFutsal, error: null });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// Update Profile Image
const updateProfileImage = async (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;
  try {
    const futsal = await Futsal.findByIdAndUpdate(
      id,
      { imageUrl },
      { new: true }
    );
    if (!futsal)
      return res.status(401).json({ data: null, error: "Image Update Failed" });
    res.status(200).json({ data: futsal, error: null });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

export {
  listFutsals,
  getFutsal,
  addFutsal,
  listNearbyFutsals,
  listPaginatedFutsals,
  updateFutsal,
  updateProfileImage,
};
