import pkg from "validator";
import mongoose from "mongoose";
const { isEmail } = pkg;
import { hashPassword } from "../utils/auth.utils.mjs";

const futsalOwnerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter valid email."],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      minLength: [8, "Password must be atleast 8 characters long."],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    lastLoggedIn: {
      type: Date,
      default: new Date().toString(),
    },
  },
  {
    timestamps: true,
  }
);

// Login Static Method
futsalOwnerSchema.statics.login = async function (email, password) {
  const futsalOwner = await this.findOne({ email });
  if (!futsalOwner) throw Error("Email does not exist");
  if (!futsalOwner.isActive) throw Error("Email is inactive");
  const user = await bcrypt.compare(password, futsalOwner.password);
  if (!user) throw Error("Invalid login credentials");
  return user;
};

// hash a password before doc is saved to db
futsalOwnerSchema.pre("save", async function (next) {
  this.password = await hashPassword(this.password);
  next();
});

const FutsalOwner = mongoose.model("FutsalOwner", futsalOwnerSchema);
export default FutsalOwner;
