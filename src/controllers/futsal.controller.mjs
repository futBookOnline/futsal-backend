import Futsal from "../models/futsal.model.mjs";

// GET API: Fetch all futsals
const fetchAllFutsalsGetRequest = async (req, res) => {
  try {
    const futsals = await Futsal.find();
    futsals.length < 1
      ? res.status(404).json({ message: "There are no futsals nearby." })
      : res.status(200).json({ futsals });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET API: Fetch One Futsal
const fetchFutsalGetRequest = async(req, res) => {
  try {
    const futsal = await Futsal.findById(req.params.id);
    futsal ? res.status(200).json({ futsal }) : res.status(404).json({ message: "Futsal Not Found" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// GET API: Find Nearby Futsals
const findNearByFutsalGetRequest = async (req, res) => {
  const{longitude, latitude} = req.query
  const radiusInKiloMeters = 5
  try {
    const futsals = await Futsal.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInKiloMeters / 6371]
        }
      }
    });
    futsals.length > 0 ? res.status(200).json({futsals}) : res.status(404).json({message: "No Futsals Nearby"})
  } catch (error) {
    res.status(400).json({message: "Error Fecthing Futsals"})
  }
}

// POST API: Add New Futsal
const addFutsalPostRequest = async (req, res) => {
  const { name, userId, address, location, contact } = req.body;
  console.log(
    `Name: ${name}, UserId: ${userId}, Address: ${address.street}, ${address.municipality}, ${address.district}, Location: ${location}, Contact: ${contact}`
  );
  try {
    const futsal = await Futsal.create({name, userId, address, location, contact});
    futsal
      ? res.status(201).json({ message: "New futsal added." })
      : res.status(400).json({ message: "Could not add new futsal." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { fetchAllFutsalsGetRequest, fetchFutsalGetRequest, addFutsalPostRequest, findNearByFutsalGetRequest };
