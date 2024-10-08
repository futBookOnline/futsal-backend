import express from "express";
import {
  addHoliday,
  deleteAllHolidays,
  deleteHoliday,
  getHoliday,
  listFutsalHolidays,
  listHolidays,
  updateHoliday,
} from "../controllers/futsal.holiday.controller.mjs";
const router = express.Router();

router.get("/", listHolidays);
router.get("/:id", getHoliday);
router.get("/venue/:venueId", listFutsalHolidays);
router.post("/add", addHoliday);
router.put("/update/:id", updateHoliday)
router.delete("/delete/all", deleteAllHolidays)
router.delete("/delete/:id", deleteHoliday)

export default router;