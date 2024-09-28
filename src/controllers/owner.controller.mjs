import FutsalOwner from "../models/owner.model.mjs";
import Futsal from "../models/venue.model.mjs";
import {
  comparePassword,
  createToken,
  hashPassword,
} from "../utils/auth.utils.mjs";

// List All Futsal Owners
const listFutsalOwners = async (req, res) => {
  try {
    const futsalOwners = await FutsalOwner.find().select("-password");
    futsalOwners.length > 0
      ? res.status(200).json(futsalOwners)
      : res.status(404).json({ message: "Empty Futsal Owners List" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET API: Get Futsal Owner By Id
const getFutsalOwner = async (req, res) => {
  const {id} = req.params
  try {
    const futsalOwner = await FutsalOwner.findById(id).select("-password");
    futsalOwner
      ? res.status(200).json(futsalOwner)
      : res.status(404).json({ message: "Empty Futsal Owners List" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add New Futsal Owner
const addFutsalOwner = async (req, res) => {
  const { email, password } = req.body;
  try {
    const futsalOwner = await FutsalOwner.create({ email, password });
    if (!futsalOwner) {
      return res.status(400).json({ message: "Could Add New Owner" });
    }
    const { password: hashedPassword, ...rest } = futsalOwner._doc;
    res.status(201).json(rest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Check Exisiting Email
const emailExists = async (req, res) => {
  const { email } = req.body;
  try {
    const futsalOwner = await FutsalOwner.findOne({ email }).select(
      "-password"
    );
    futsalOwner
      ? res.status(400).json(futsalOwner, { message: "Email already used" })
      : res.status(200).json({ message: "Email not found" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Login Futsal Owner
const loginFutsalOwner = async (req, res) => {
  const { email, password } = req.body;
  try {
    const futsalOwner = await FutsalOwner.login(email, password);
    if (futsalOwner) {
      // const futsalExists = await Futsal.findOne({ userId: futsalOwner._id });
      // if (!futsalExists)
      //   return res.status(300).json({ message: "Create futsal profile" });
      // const { password: hashedPassword, ...rest } = futsalOwner._doc;
      // if (!futsalExists.isOnboarded)
      //   return res
      //     .status(403)
      //     .json({ user: rest, message: "User is not onboarded" });
      const { password: hashedPassword, ...rest } = futsalOwner._doc;
      if (!futsalOwner.isOnboarded) return res.status(200).json(rest)
      const token = createToken(futsalOwner._id);
      const maxAge = 3 * 24 * 60 * 60;
      res
        .cookie("jwt_login_owner", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
          maxAge: maxAge * 1000,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Futsal Onboard Owner
const updateOnboardStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const futsalOwner = await FutsalOwner.findByIdAndUpdate(
      id,
      { isOnboarded: true },
      { new: true }
    );
    return futsalOwner
      ? res.status(201).json(futsalOwner)
      : res.status(404).json({ message: "Futsal owner does not exist." });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
        .json({ message: "Invalid Id. Could not activate email" });
    const { password: hashPassword, ...rest } = futsalOwner._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT API: Change Password
const changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await FutsalOwner.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const checkOldPassword = await comparePassword(oldPassword, user.password);
    if (!checkOldPassword)
      return res.status(401).json({ message: "wrong password" });
    const checkNewPassword = await comparePassword(newPassword, user.password);
    if (checkNewPassword)
      return res.status(401).json({
        message: "New password and old password cannot be same",
      });
    const hashedPassword = await hashPassword(newPassword);
    const updatePassword = await FutsalOwner.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    if (!updatePassword)
      return res.status(500).json({ message: "Update Failed" });
    const { password: hashedPass, ...rest } = updatePassword._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT API: Reset Password
const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
    const user = await FutsalOwner.findById(id);
    if (!user) return res.status(401).json({ message: "User not found" });
    if (!user.isActive)
      return res.status(401).json({ message: "User is not active" });
    const checkOldPassword = await comparePassword(password, user.password);
    if (checkOldPassword)
      return res.status(401).json({
        message: "New password cannot be same as old password",
      });

    const hashedPassword = await hashPassword(password);
    const updateUser = await FutsalOwner.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    const { password: hashedPass, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Futsal Owner
const deleteFutsalOwner = async (req, res) => {
  const { id } = req.params;
  try {
    const futsalOwner = await FutsalOwner.findByIdAndDelete(id);
    if (!futsalOwner) {
      return res.status(404).json({ message: "Futsal Owner Not Found" });
    }
    const { password: hashedPassword, ...rest } = futsalOwner._doc;
    return res.status(200).json(rest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Logout Futsal Owner
const logoutFutsalOwner = async (req, res) => {
  res.cookie("jwt_login_owner", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out successfully." });
};

export {
  listFutsalOwners,
  getFutsalOwner,
  addFutsalOwner,
  emailExists,
  updateOnboardStatus,
  loginFutsalOwner,
  activateEmail,
  deleteFutsalOwner,
  logoutFutsalOwner,
  changePassword,
  resetPassword,
};
