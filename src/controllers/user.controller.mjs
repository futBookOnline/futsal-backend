import User from "../models/user.model.mjs";
import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";

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

// Create JWT Token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "futsal booking secret", { expiresIn: maxAge });
};

// GET API: Fetch All Users
const fetchAllUsersGetRequest = async (req, res) => {
  try {
    const users = await User.find();
    users.length > 0
      ? res.status(200).json({ users })
      : res.status(404).json({ message: "No users available." });
  } catch (error) {
    res.status(400).json({
      message: "Connection with server failed: Could not fetch users",
    });
  }
};

// POST API: Register User
const addUserPostRequest = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    res
      .status(201)
      .json({ message: "User registration successful", user: user });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
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
const activateEmailPostRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User status changes to active." });
  } catch (error) {
    res.status(400).json({ message: "Could not activate user status." });
  }
};

// POST API: Login User
const loginUserPostRequest = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ message: "Login successful", id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET API: Logout User
const logOutUserGetRequest = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out successfully." });
};

export {
  fetchAllUsersGetRequest,
  addUserPostRequest,
  loginUserPostRequest,
  logOutUserGetRequest,
  activateEmailPostRequest,
};
