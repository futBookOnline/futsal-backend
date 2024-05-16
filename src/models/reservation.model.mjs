import mongoose, { model } from "mongoose";
import pkg from "validator";
const { isEmail } = pkg;

const reservationSchema = mongoose.Schema(
  {
    venueId: {
      type: String,
      required: [true, "Futsal Id is required"],
    },
    futsalName: {
      type: String,
      required: [true, "Futsal name is required."],
    },
    futsalAddress: {
      street: {
        type: String,
        required: [true, "Street address is required."],
      },
      municipality: {
        type: String,
        required: [true, "Municipality name is required."],
      },
      district: {
        type: String,
        required: [true, "District name is required."],
      },
    },
    futsalContact: {
      type: Number,
      required: [true, "Futsal contact is required."],
    },
    futsalEmail: {
      type: String,
      required: [true, "Futsal email is required."],
      lowercase: true,
      validate: [isEmail, "Please enter valid email."],
    },
    userId: {
      type: String,
      default: null,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required."],
    },
    contact: {
      type: Number,
      required: [true, "Phone number is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      lowercase: true,
      validate: [isEmail, "Please enter valid email."],
    },
    reservationDate: {
      year: {
        type: Number,
        required: [true, "Reservation year is required."],
      },
      month: {
        type: Number,
        required: [true, "Reservation month is required."],
      },
      day: {
        type: Number,
        required: [true, "Reservation day is required."],
      },
    },
    reservationTime: {
      hour: {
        type: Number,
        required: [true, "Reservation hour is required."],
      },
      minute: {
        type: Number,
        required: [true, "Reservation  minute is required."],
      },
    },
    reservationId: {
      type: String,
      required: [true, "Reservation ID is required."],
    },
  },
  {
    timestamps: true,
  }
);

const FutsalReservation = mongoose.model(
  "FutsalReservation",
  reservationSchema
);
export default FutsalReservation;
