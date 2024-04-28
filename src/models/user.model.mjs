import pkg from "validator";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { isEmail } = pkg;

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter email."],
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

// hash a password before doc is saved to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Email does not exist");
  }
  if(!user.isActive){
    throw Error("Email is not active.")
  }
  const auth = await bcrypt.compare(password, user.password);
  if (auth) {
    return user;
  }
  throw Error("Invalid Login Credentials");
};

// password hashing function
userSchema.statics.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt()
  const result = await bcrypt.hash(password, salt)
  return result
}

const User = mongoose.model("User", userSchema);
export default User;
