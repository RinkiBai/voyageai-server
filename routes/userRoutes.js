import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadProfilePic,
  changePassword,
  getUserSettings,
  updateUserSettings,
  forgotPassword,         // ✅ added
  resetPassword           // ✅ added
} from "../controllers/userController.js";

const router = express.Router();

// ✅ Register (with optional profile picture)
router.post("/register", upload.single("profilePic"), registerUser);

// ✅ Login
router.post("/login", loginUser);

// ✅ Forgot / Reset Password
router.post("/forgot-password", forgotPassword);             // 🔑 Send reset link
router.post("/reset-password/:token", resetPassword);        // 🔐 Reset password

// ✅ Get user profile
router.get("/profile", authenticateUser, getUserProfile);

// ✅ Update user profile
router.put("/update", authenticateUser, updateUserProfile);

// ✅ Upload profile picture
router.post(
  "/upload-profile-pic",
  authenticateUser,
  upload.single("profilePic"),
  uploadProfilePic
);

// ✅ Change password
router.post("/change-password", authenticateUser, changePassword);

// ✅ Settings
router.get("/settings", authenticateUser, getUserSettings);
router.put("/settings", authenticateUser, updateUserSettings);

export default router;
