import FutsalOwner from "../models/futsal.owner.model.mjs";
import { createToken } from "../utils/auth.utils.mjs";

// List All Futsal Owners
const listFutsalOwners = async (req, res) => {
  try {
    const futsalOwners = await FutsalOwner.find().select("-password");
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

// Login Futsal Owner
const loginFutsalOwner = async (req, res) => {
  const { email, password } = req.body;
  try {
    const futsalOwner = await FutsalOwner.login(email, password);
    const { password: hashedPassword, ...rest } = futsalOwner._doc;
    const token = createToken(futsalOwner._id);
    const maxAge = 3 * 24 * 60 * 60;
    res
      .cookie("jwt-login-owner", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      })
      .status(200)
      .json({ data: rest, error: null });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// Activate Email
const activateEmail = async (req, res) => {
  const { id } = req.params;
  try {
    const futsalOwner = await FutsalOwner.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );
    if (!futsalOwner)
      return res
        .status(404)
        .json({ data: null, error: "Invalid Id. Could not activate email" });
    const { password: hashPassword, ...rest } = futsalOwner._doc;
    res.status(200).json({ data: rest, error: null });
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

// Logout Futsal Owner
const logoutFutsalOwner = async (req, res) => {
  res.cookie("jwt-login-owner", "", { maxAge: 1 });
  res.status(200).json({ data: "Logged out successfully.", error: null });
};

export {
  listFutsalOwners,
  addFutsalOwner,
  loginFutsalOwner,
  activateEmail,
  deleteFutsalOwner,
  logoutFutsalOwner,
};
