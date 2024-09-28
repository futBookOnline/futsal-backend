import mongoose from "mongoose";
const holidaySchema = mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true, // Ensure no duplicate holidays for the same date
    },
    name: {
      type: String, // Name of the holiday, e.g., 'Christmas', 'New Year's Day'
    },
    description: {
      type: String, // Optional description of the holiday
    },
  },
  {
    timestamps: true,
  }
);
const Holiday = mongoose.model("Holiday", holidaySchema);
export default Holiday;
