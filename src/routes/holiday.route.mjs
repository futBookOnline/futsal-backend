import express, { Router } from "express";
import {
  listHolidays,
  getHoliday,
  addHoliday,
  updateHoliday,
  deleteHoliday,
  deleteAllHolidays
} from "../controllers/holiday.controller.mjs";

const router = express.Router();

router.get("/", listHolidays);
router.get("/:id", getHoliday);
router.post("/add", addHoliday);
router.put("/update/:id", updateHoliday);
router.delete("/delete/all", deleteAllHolidays);
router.delete("/delete/:id", deleteHoliday);

export default router;
