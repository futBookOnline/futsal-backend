import "dotenv/config";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import futsalUserRoute from "./routes/user.route.mjs";
import futsalRoute from "./routes/venue.route.mjs";
import futsalOwnerRoute from "./routes/owner.route.mjs";
import googleAuthRoute from "./routes/google.auth.route.mjs";
import reservationRoute from "./routes/reservation.route.mjs";
import mailerRoute from "./routes/mailer.route.mjs";
import holidayRoute from "./routes/holiday.route.mjs"
import slotRoute from "./routes/slot.route.mjs"
import { setupWebSocket } from "./sockets/socket.handler.mjs";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const hostname = "http://localhost:";

const mongoUrl = process.env.MONGODB_URI;

// Web Socket
setupWebSocket(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.CLIENT_OWNER_URL,
      process.env.CLIENT_USER_URL,
      process.env.CLIENT_DEVELOPMENT_URL,
      process.env.VERCEL_CLIENT_USER_URL,
      process.env.NETLIFY_CLIENT_USER_URL,
      process.env.NETLIFY_CLIENT_OWNER_URL,
    ],
    credentials: true,
  })
);

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
    });
});

// Routes
app.use("/users", futsalUserRoute);
app.use("/venues", futsalRoute);
app.use("/owners", futsalOwnerRoute);
app.use("/auth/google", googleAuthRoute);
app.use("/reservations", reservationRoute);
app.use("/email", mailerRoute);
app.use("/holidays", holidayRoute);
app.use("/slots", slotRoute);