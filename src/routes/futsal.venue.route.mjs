import express from "express";
const router = express.Router();
import {
  listFutsals,
  getFutsal,
  addFutsal,
  listNearbyFutsals,
  listPaginatedFutsals,
} from "../controllers/futsal.venue.controller.mjs";

// router.get("/", listFutsals);
router.get("/", listPaginatedFutsals);
router.get("/location", listNearbyFutsals);
router.get("/:id", getFutsal);
router.post("/add", addFutsal);

export default router;
