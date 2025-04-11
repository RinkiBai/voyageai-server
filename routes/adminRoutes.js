// routes/adminRoutes.js
import express from "express";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllBookings, // ✅ added this
} from "../controllers/adminController.js";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Apply auth + admin guard to all routes
router.use(authenticateUser, authorizeAdmin);

// ✅ User Management
router.get("/users", getAllUsers);                  // Get all users
router.put("/users/:id/role", updateUserRole);      // Promote/Demote role
router.delete("/users/:id", deleteUser);            // Delete user

// ✅ Booking Management
router.get("/bookings", getAllBookings);            // View all bookings

export default router;
