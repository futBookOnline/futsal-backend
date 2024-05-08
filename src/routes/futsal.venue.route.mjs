import express from "express";
const router = express.Router();
import {
  listFutsals,
  getFutsal,
  addFutsal,
  listNearbyFutsals,
  listPaginatedFutsals,
  updateFutsal
} from "../controllers/futsal.venue.controller.mjs";

// router.get("/", listFutsals);
router.get("/", listPaginatedFutsals);
router.get("/location", listNearbyFutsals);
router.get("/:id", getFutsal);
router.post("/add", addFutsal);
router.put("/update/:id", updateFutsal)

export default router;
