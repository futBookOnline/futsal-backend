import mongoose from "mongoose";

const futsalSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full Name is required."],
    },
    userId: {
        type: String,
        required: [true, "User Id is required."]
    },
    address: {
        street: {
            type: String,
            required: [true, "Street address is required."]
        },
        municipality: {
            type: String,
            required: [true, "Municipality name is required."]
        },
        district:{
            type: String,
            required: [true, "District name is required."]
        }
        // OR
        // type: Object
    },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: {
          type: [Number],
          index: '2dsphere' // Create a 2dsphere index on the 'location' field
        }
      },
      
    contact: {
        type: Number,
        required: [true, "Contact is required."]
    }
  },
  { timestamps: true }
);

const Futsal = mongoose.model("Futsal", futsalSchema)
export default Futsal