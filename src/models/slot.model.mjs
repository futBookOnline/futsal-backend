import mongoose from "mongoose";
const slotSchema = mongoose.Schema(
    {
        venueId: {
            type: String,
          },
          startTime: {
            type: String, // Time format (e.g., '08:00')
          },
          endTime: {
            type: String, // Time format (e.g., '09:00')
          },
          date: {
            type: Date, // Date for the slot
          },
          basePrice: {
            type: Number,
          },
          dynamicPrice: {
            type: Number, // Adjusted price based on time of day, weekend, holiday, etc.
          },
          isWeekend: {
            type: Boolean,
            default: false,
          },
          isHoliday: {
            type: Boolean,
            default: false,
          },
    },
    { timestamps: true }
)
const Slot = mongoose.model("Slot", slotSchema);
export default Slot;