import express from "express";
import {
  listSlots,
  getSlotBySlotId,
  listSlotsByVenue,
  addDailySlots,
  addWeeklySlots,
  updateSlot,
  deleteSlot,
  deleteMultipleSlotsByVenue
} from "../controllers/slot.controller.mjs";
const router = express.Router();

router.get("/", listSlots);
router.get("/venue", listSlotsByVenue);
router.get("/:id", getSlotBySlotId)
router.post("/generate-slots", addDailySlots);
router.post("/generate-slots-weekly", addWeeklySlots);
router.put("/update/:id", updateSlot);
router.delete("/venue/delete/", deleteMultipleSlotsByVenue)
router.delete("/delete/:id", deleteSlot)


export default router