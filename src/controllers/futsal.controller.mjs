import Futsal from "../models/futsal.model.mjs";

// GET API: Fetch all futsals
const fetchAllFutsalsGetRequest = async (req, res) => {
  try {
    const futsals = await Futsal.find();
    futsals.length < 1
      ? res
          .status(404)
          .json({ data: null }, { error: "There are no futsals nearby." })
      : res.status(200).json({ data: futsals }, { error: null });
  } catch (error) {
    res.status(400).json({ data: null }, { error: error.message });
  }
};

// GET API: Fetch One Futsal
const fetchFutsalGetRequest = async (req, res) => {
  try {
    const futsal = await Futsal.findById(req.params.id);
    futsal
      ? res.status(200).json({ data: futsal }, {error: null})
      : res.status(404).json({data: null}, { error: "Futsal Not Found" });
  } catch (error) {
    res.status(400).json({data: null}, { error: error.message });
  }
};

// GET API: Find Nearby Futsals
const findNearByFutsalGetRequest = async (req, res) => {
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
      ? res.status(200).json({ data: futsals }, { error: null })
      : res.status(404).json({ data: null }, { error: "No Futsals Nearby" });
  } catch (error) {
    res.status(400).json({ data: null }, { error: error.message });
  }
};

// POST API: Add New Futsal
const addFutsalPostRequest = async (req, res) => {
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
      ? res.status(201).json({ data: futsal }, { error: null })
      : res
          .status(400)
          .json({ data: null }, { error: "Could not add new futsal." });
  } catch (error) {
    res.status(400).json({ data: null }, { error: error.message });
  }
};

export {
  fetchAllFutsalsGetRequest,
  fetchFutsalGetRequest,
  addFutsalPostRequest,
  findNearByFutsalGetRequest,
};
