import Futsal from "../models/futsal.model.mjs";
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
const listUsers = async (req, res) => {
  try {
    const users = await User.find();
    users.length > 0
      ? res.status(200).json({ data: users, error: null })
      : res.status(404).json({ data: null, error: "No users available." });
  } catch (error) {
    res.status(400).json({
      data: null,
      error: "Connection with server failed: Could not fetch users",
    });
  }
};

// GET API: Fetch One User By Id
const getUser = async (req, res) => {
  const id  = req.params.id;
  try {
    const user = await User.findById(id);
    user
      ? res.status(200).json({ data: user, error: null })
      : res.status(404).json({ data: null, error: "User Not Found" });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// POST API: Register User
const addUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    res.status(201).json({ data: user, error: null });
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
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );
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
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ data: user, error: null });
  } catch (error) {
    res.status(400).json({ data: null, error: error.message });
  }
};

// POST API: Reset Password
const resetPassword = async (req, res) => {
  const {email, password} = req.body
  try {
    const hashedPassword = await User.hashPassword(password)
    const user = await User.findOneAndUpdate({email: email}, {password: hashedPassword}, {new: true})
    user ? res.status(200).json({data: user, error: null}) : res.status(404).json({data: null, error: "User Not Found"})
  } catch (error) {
    res.status(400).json({data: null, error: error.message})
  }
   
}

// GET API: Logout User
const logoutUser = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ data: "Logged out successfully.", error: null });
};

export {
  listUsers,
  getUser,
  addUser,
  loginUser,
  logoutUser,
  activateEmail,
  resetPassword
};
