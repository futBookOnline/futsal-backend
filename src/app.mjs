import 'dotenv/config'
import express from "express"
import mongoose from 'mongoose'
import cookieParser from "cookie-parser"
import cors from "cors"

import futsalUserRoute from "./routes/user.route.mjs"
import futsalRoute from "./routes/venue.route.mjs"
import futsalOwnerRoute from "./routes/owner.route.mjs"
import googleAuthRoute from "./routes/google.auth.route.mjs"
import reservationRoute from "./routes/reservation.route.mjs"
import mailerRoute from "./routes/mailer.route.mjs"

const app  = express()
const port = process.env.PORT || 3000;
const hostname = "http://localhost:";

const mongoUrl = process.env.MONGODB_URI
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Adjust timeout as needed
  connectTimeoutMS: 10000, // Adjust timeout as needed
};
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(cors())

// Database Connection
app.listen(port, () => {
  console.log(`Server is running at ${hostname}${port}`);
  mongoose
  .connect(mongoUrl, options)
  .then(() => {
    console.log("Database Connection Successful.");
  })
  .catch((error) => {
    console.log("Database Connection Failed: ", error.message);
  })
});


// Routes
app.use("/users", futsalUserRoute)
app.use("/venues", futsalRoute)
app.use("/owners", futsalOwnerRoute)
app.use("/auth/google", googleAuthRoute);
app.use("/reservations", reservationRoute)
app.use("/email", mailerRoute)
