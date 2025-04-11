import express from "express";
import { createTrip, getUserTrips } from "../controllers/tripController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new trip
router.post("/create", authenticateUser, createTrip);

// Get user trips
router.get("/", authenticateUser, getUserTrips);

export default router;
