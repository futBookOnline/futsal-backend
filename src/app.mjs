import 'dotenv/config'
import express from "express"
import mongoose from 'mongoose'
import cookieParser from "cookie-parser"
import cors from "cors"

import futsalUserRoute from "./routes/futsal.user.route.mjs"
import futsalRoute from "./routes/futsal.venue.route.mjs"
import futsalOwnerRoute from "./routes/futsal.owner.route.mjs"
import authRoute from "./routes/auth.route.mjs"

const app  = express()
const port = 3000 || process.env.PORT;
const hostname = "http://localhost:";

const mongoUrl = process.env.MONGODB_URI

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(cors())

// Database Connection
app.listen(port, () => {
  console.log(`Server is running at ${hostname}${port}`);
  mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connection Successful.");
  })
  .catch((error) => {
    console.log("Database Connection Failed: ", error.message);
  })
});


// Routes
app.use("/players/users", futsalUserRoute)
app.use("/futsals", futsalRoute)
app.use("/owners/users", futsalOwnerRoute)
app.use("/auth/google", authRoute);
