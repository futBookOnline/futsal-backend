import express from "express";
import Futsal from "../models/venue.model.mjs";
import { generateSlots, generateSlotsForWeek } from "../utils/slot.utils.mjs";
const router = express.Router();
import {
  listFutsals,
  getFutsal,
  addFutsal,
  listNearbyFutsals,
  listPaginatedFutsals,
  getVenueByUserId,
  updateFutsal,
  updateProfileImage,
  enableDisableVenue,
  deleteVenue,
  deleteAllVenues,
} from "../controllers/venue.controller.mjs";
import { multerUpload } from "../utils/uploadPhoto.utils.mjs";

router.get("/", listFutsals);
// router.get("/", listPaginatedFutsals);
router.get("/location", listNearbyFutsals);
router.get("/current/:id", getVenueByUserId);
router.get("/:id", getFutsal);
router.post("/add", addFutsal);
router.put("/update/:id", multerUpload.single("file"), updateFutsal);
router.put("/upload-image", updateProfileImage);
router.put("/enable-disable/", enableDisableVenue)
router.delete("/delete/:id", deleteVenue)
router.delete("/delete-all", deleteAllVenues)
export default router;
