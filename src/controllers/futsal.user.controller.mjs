import FutsalUser from "../models/futsal.user.model.mjs";
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
      ? res.status(200).json({ data: futsalUsers, error: null })
      : res.status(404).json({ data: null, error: "No users available." });
  } catch (error) {
    res.status(400).json({
      data: null,
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
      ? res.status(200).json({ data: user, error: null })
      : res.status(404).json({ data: null, error: "User Not Found" });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// POST API: Register User
const addUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(fullName, email, password)
  try {
    // const user = await FutsalUser.create({ fullName, email, password });
    const user = await FutsalUser.register(fullName, email, password);
    // if (!user)
    //   return res
    //     .status(400)
    //     .json({ data: null, error: "Could not register new user" });
    const { password: hashedPassword, ...rest } = user._doc;
    res.status(201).json({ data: rest, error: null });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ data: null, error: errors });
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
      res.status(404).json({ data: null, error: "User not found." });
    }
    res.status(200).json({ data: user, error: null });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
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
      .json({ data: rest, error: null });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// POST API: Reset Password
const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const user = await FutsalUser.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );
    if (!user)
      return res
        .status(404)
        .json({ data: null, error: "Password reset failed" });
    const { password: hashed, ...rest } = user._doc;
    res.status(200).json({ data: rest, error: null });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// POST API: Change Password
const changePassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const user = await FutsalUser.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );
    if (!user)
      return res.status(404).json({ data: null, error: "User Not Found" });
    const { password: hashed, ...rest } = user._doc;
    res.status(200).json({ data: rest, error: null });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// GET API: Logout User
const logoutUser = (req, res) => {
  res.cookie("jwt-login-user", "", { maxAge: 1 });
  res.status(200).json({ data: "Logged out successfully.", error: null });
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
};
