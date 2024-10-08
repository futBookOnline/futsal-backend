import mongoose from "mongoose";
import pkg from "validator";
const { isEmail } = pkg;
const futsalCustomerSchema = mongoose.Schema(
  {
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: "FutsalVenue" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "FutsalUser" },
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
  },
  {
    timestamps: true,
  }
);
const FutsalCustomer = mongoose.model("FutsalCustomer", futsalCustomerSchema);
export default FutsalCustomer;
