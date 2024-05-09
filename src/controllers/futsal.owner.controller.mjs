import FutsalOwner from "../models/futsal.owner.model.mjs";
import Futsal from "../models/futsal.venue.model.mjs";
import {
  comparePassword,
  createToken,
  hashPassword,
} from "../utils/auth.utils.mjs";

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
    if (futsalOwner) {
      const futsalExists = await Futsal.findOne({ userId: futsalOwner._id });
      if (!futsalExists)
        return res
          .status(300)
          .json({ data: null, error: "create futsal profile" });
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
    }
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

// POST API: Change Password
const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  try {
    const user = await FutsalOwner.findById(userId);
    if (!user)
      return res.status(404).json({ data: null, error: "User not found" });
    const checkOldPassword = await comparePassword(oldPassword, user.password);
    if (!checkOldPassword)
      return res.status(401).json({ data: null, error: "wrong password" });
    const checkNewPassword = await comparePassword(newPassword, user.password);
    if (checkNewPassword)
      return res.status(401).json({
        data: null,
        error: "New password and old password cannot be same",
      });
    const hashedPassword = await hashPassword(newPassword);
    const updatePassword = await FutsalOwner.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    if (!updatePassword)
      return res.status(500).json({ data: null, error: "Update Failed" });
    const { password: hashedPass, ...rest } = updatePassword._doc;
    res.status(200).json({ data: rest, error: null });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { id, password } = req.body;
  try {
    const user = await FutsalOwner.findById(id);
    if (!user)
      return res.status(401).json({ data: null, error: "User not found" });
    if (!user.isActive)
      return res.status(401).json({ data: null, error: "User is not active" });
    const checkOldPassword = await comparePassword(password, user.password);
    if (checkOldPassword)
      return res
        .status(401)
        .json({
          data: null,
          error: "New password cannot be same as old password",
        });

    const hashedPassword = await hashPassword(password);
    const updateUser = await FutsalOwner.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    if (!user)
      return res
        .status(401)
        .json({ data: null, error: "Password reset failed" });
    const { password: hashedPass, ...rest } = updateUser._doc;
    res.status(200).json({ data: rest, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
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
  changePassword,
  resetPassword,
};
