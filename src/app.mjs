import 'dotenv/config'
import express from "express"
import mongoose from 'mongoose'
import cookieParser from "cookie-parser"
import cors from "cors"

import userRoute from "./routes/user.route.mjs"
import futsalRoute from "./routes/futsal.route.mjs"
import futsalOwnerRoute from "./routes/futsal.owner.route.mjs"

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
app.use("/users", userRoute)
app.use("/futsals", futsalRoute)
app.use("/owners/users", futsalOwnerRoute)
