import pkg from "validator";
import mongoose from "mongoose";
const { isEmail } = pkg;
const contactEmailSchema = mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      validate: [isEmail, "Please enter valid email."],
    },
    fullName: {
      type: String,
    },
    contact: {
      type: String,
    },
    comment: { type: String },
    isOpened: { type: Boolean, default: false },
    futsalOwnerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'FutsalOwner' },
  },
  { timestamps: true }
);

const ContactEmail = mongoose.model("ContactEmail", contactEmailSchema);
export default ContactEmail;
