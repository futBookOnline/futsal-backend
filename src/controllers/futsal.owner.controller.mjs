import FutsalOwner from "../models/futsal.owner.model.mjs";

// List All Futsal Owners
const listFutsalOwners = async (req, res) => {
  try {
    const futsalOwners = await FutsalOwner.find();
    futsalOwners
      ? res.status(200).json({ data: futsalOwners, error: null })
      : res.status(404).json({ data: null, error: "Empty Futsal Owners List" });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// Add New Futsal Owner
const addFutsalOwner = async (req, res) => {
  const { email, password } = req.body;
  try {
    const futsalOwner = await FutsalOwner.create({ email, password });
    if (!futsalOwner) {
      return res.status(400).json({ data: null, error: "Could Add New Owner" });
    }
    const { password: hashedPassword, ...rest } = futsalOwner._doc;
    res.status(201).json({ data: rest, error: null });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// Delete Futsal Owner
const deleteFutsalOwner = async (req, res) => {
  const { id } = req.params;
  try {
    const futsalOwner = await FutsalOwner.findByIdAndDelete(id);
    if (!futsalOwner) {
      return res
        .status(404)
        .json({ data: null, error: "Futsal Owner Not Found" });
    }
    const { password: hashedPassword, ...rest } = futsalOwner._doc;
    return res.status(200).json({ data: rest, error: null });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

export { listFutsalOwners, addFutsalOwner, deleteFutsalOwner };
