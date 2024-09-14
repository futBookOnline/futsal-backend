import mongoose, { model } from "mongoose";
import pkg from "validator";
const { isEmail } = pkg;

const reservationSchema = mongoose.Schema(
  {
    venueId: {
      type: String,
      required: [true, "Futsal Id is required"],
    },
    userId: {
      type: String,
    },
    guestUser: {
      fullName: {
        type: String,
      },
      contact: {
        type: Number,
      },
      email: {
        type: String,
        lowercase: true,
        validate: [isEmail, "Please enter valid email."],
      },

    },
    reservationDate: {
        type: Date,
        required: [true, "Reservation date is required."],
    },
    reservationTime: {
      type: String,
      requried: [true, "Reservation time is required"]
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
