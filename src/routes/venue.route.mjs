import express from "express";
const router = express.Router();
import {
  listFutsals,
  getFutsal,
  addFutsal,
  listNearbyFutsals,
  listPaginatedFutsals,
  updateFutsal,
  updateProfileImage
} from "../controllers/venue.controller.mjs";
import { multerUpload } from "../utils/uploadPhoto.utils.mjs";

// router.get("/", listFutsals);
router.get("/", listPaginatedFutsals);
router.get("/location", listNearbyFutsals);
router.get("/:id", getFutsal);
router.post("/add", multerUpload.single("file"), addFutsal);
router.put("/update/:id", updateFutsal)
router.put("/upload-image", updateProfileImage)

export default router;
