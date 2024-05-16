import mongoose from "mongoose";

const futsalSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full Name is required."],
    },
    userId: {
      type: String,
      required: [true, "User Id is required."],
    },
    address: {
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
      // OR
      // type: Object
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: {
        type: [Number],
        index: "2dsphere", // Create a 2dsphere index on the 'location' field
      },
    },

    contact: {
      type: Number,
      required: [true, "Contact is required."],
    },
    imageUrl: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/futsal-management-cfe31.appspot.com/o/Assets%2Fa.png?alt=media&token=b7a82288-e014-4a12-872c-1967c994e732",
    },
    opensAt: {
      hour: {
        type: Number,
        required: [true, "Opening hour is required"],
      },
      minute: {
        type: Number,
        required: [true, "Opening minute is required"],
      },
    },
    closesAt: {
      hour: {
        type: Number,
        required: [true, "Closing hour is required"],
      },
      minute: {
        type: Number,
        required: [true, "Closing minute is required"],
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
  },
  { timestamps: true }
);

const Futsal = mongoose.model("FutsalVenue", futsalSchema);
export default Futsal;
