import express from "express";
import {getAllCustomers, getCustomersByVenue, deletetAllCustomer } from "../controllers/futsal.customer.controller.mjs";
const router = express.Router()

// DELETE ALL CUSTOMERS
router.get("/", getAllCustomers)
router.get("/venue/:venueId", getCustomersByVenue)
router.delete("/delete-all", deletetAllCustomer)


export default router