// routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  getBookings,
  getUserBookings,
  cancelBooking,
} from "../controllers/bookingController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new booking
router.post("/", authenticateUser, createBooking);

// Get all bookings (optional admin access in future)
router.get("/", authenticateUser, getBookings);

// Get bookings for logged-in user
router.get("/my-bookings", authenticateUser, getUserBookings);

// Cancel a booking
router.delete("/:id", authenticateUser, cancelBooking);

export default router;
