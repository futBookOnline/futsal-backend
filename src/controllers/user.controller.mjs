import FutsalUser from "../models/user.model.mjs";
import {
  createToken,
  hashPassword,
  comparePassword,
} from "../utils/auth.utils.mjs";

// Handle Errors
const handleErrors = (err) => {
  let errors = { email: "", password: "" };
  if (err.code === 11000) {
    errors.email = "This email is already registered.";
    return errors;
  }
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// GET API: Fetch All Users
const listUsers = async (req, res) => {
  try {
    const futsalUsers = await FutsalUser.find().select("-password");
    futsalUsers
      ? res.status(200).json({ data: futsalUsers})
      : res.status(404).json({ error: "No users available." });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

// GET API: Fetch One User By Id
const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await FutsalUser.findById(id).select("-password");
    user
      ? res.status(200).json({ data: user })
      : res.status(404).json({error: "User Not Found" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POST API: Register User
const addUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(fullName, email, password);
  try {
    // const user = await FutsalUser.create({ fullName, email, password });
    const user = await FutsalUser.register(fullName, email, password);
    // if (!user)
    //   return res
    //     .status(400)
    //     .json({ data: null, error: "Could not register new user" });
    const { password: hashedPassword, ...rest } = user._doc;
    res.status(201).json({ data: rest });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ error: errors });
  }
};

// Send Email Verification
// const sendEmailVerification = async (email, id) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: "Futsal Finder: Verify your email",
//     text: `http://localhost:3000/users/:${id}`,
//   };
//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Email Sent")
//   } catch (error) {
//    console.log("FAILED: ", error.message)
//   }
// };

// PUT API: Activate Email
const activateEmail = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await FutsalUser.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).select("-password");
    if (!user) {
      res.status(404).json({ error: "User not found." });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({error: error.message });
  }
};

// POST API: Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await FutsalUser.login(email, password);
    const token = createToken(user._id);
    const maxAge = 3 * 24 * 60 * 60;
    const { password: hashedPassword, ...rest } = user._doc;
    res
      .cookie("jwt-login-user", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      })
      .status(200)
      .json({ data: rest });
  } catch (error) {
    res.status(400).json({error: error.message });
  }
};

// PUT API: Reset Password
const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;
  try {
    if(!password) return res.status(401).json({error: "Password cannot be empty"})
    const user = await FutsalUser.findById(id);
    if (!user)
      return res.status(401).json({  error: "User not found" });
    if (!user.isActive)
      return res.status(401).json({  error: "User is not active" });
    const checkOldPassword = await comparePassword(password, user.password);
    if (checkOldPassword)
      return res.status(401).json({
        error: "New password cannot be same as old password",
      });

    const hashedPassword = await hashPassword(password);
    const updateUser = await FutsalUser.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    const { password: hashedPass, ...rest } = updateUser._doc;
    res.status(200).json({ data: rest });
  } catch (error) {
    res.status(400).json({  error: error.message });
  }
};

// PUT API: Change Password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.params;
  try {
    if (!oldPassword || !newPassword)
      return res.status(401).json({
        error: !oldPassword
          ? "Old password cannot be empty"
          : "New password cannot be empty",
      });
    const user = await FutsalUser.findById(id);
    if (!user)
      return res.status(404).json({ error: "User not found" });
    const checkOldPassword = await comparePassword(oldPassword, user.password);
    if (!checkOldPassword)
      return res.status(401).json({  error: "wrong password" });
    const checkNewPassword = await comparePassword(newPassword, user.password);
    if (checkNewPassword)
      return res.status(401).json({
        error: "New password and old password cannot be same",
      });
    const hashedPassword = await hashPassword(newPassword);
    const updatePassword = await FutsalUser.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    if (!updatePassword)
      return res.status(500).json({error: "Update Failed" });
    const { password: hashedPass, ...rest } = updatePassword._doc;
    res.status(200).json({ data: rest });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT API: Update User Info
const updateUser = async(req, res) => {
  const {id} = req.params
  const updateFields = req.body
  try {
    const updateUser = await FutsalUser.findByIdAndUpdate(id, {$set: updateFields}, {new: true})
    if(!updateUser) return res.status(401).json({ error: "Could not update user"})
      const{password, ...rest} = updateUser._doc
    res.status(200).json({data: rest})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}


// PUT API: Update Profile Picture
const updateProfilePicture = async (req, res) => {
  const {imageUrl } = req.body;
  const {id} = req.params
  try {
    const user = await FutsalUser.findByIdAndUpdate(
      id,
      { imageUrl },
      { new: true }
    ).select("-password");
    if (!user)
      return res.status(401).json({ error: "Image Update Failed" });
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({error: error.message });
  }
};

// GET API: Logout User
const logoutUser = (req, res) => {
  res.cookie("jwt-login-user", "", { maxAge: 1 });
  res.status(200).json({ data: "Logged out successfully." });
};

export {
  listUsers,
  getUser,
  addUser,
  loginUser,
  logoutUser,
  activateEmail,
  resetPassword,
  changePassword,
  updateUser,
  updateProfilePicture
};
