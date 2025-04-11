// controllers/userController.js
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../config/cloudinary.js";
import { sendResetEmail } from "../utils/sendEmail.js";


// JWT Token Generator
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const profilePic = req.file ? req.file.path : "";

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    profilePic,
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    },
  });
});

// ✅ Login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        phone: user.phone,
        bio: user.bio,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// ✅ Get Profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// ✅ Update Profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, email, phone, bio } = req.body;

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.bio = bio || user.bio;

  const updatedUser = await user.save();

  res.json({
    message: "Profile updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    },
  });
});

// ✅ Upload Profile Pic
export const uploadProfilePic = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!req.file || !user) {
    res.status(400);
    throw new Error("No image or user found");
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "voyageai/profilePics",
  });

  user.profilePic = result.secure_url;
  await user.save();

  res.json({ message: "Profile picture uploaded", profilePic: user.profilePic });
});

// ✅ Change Password
export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { currentPassword, newPassword } = req.body;

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password changed successfully" });
});

// ✅ Get User Settings
export const getUserSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    notifications: user.notifications ?? true,
    language: user.language ?? "en",
  });
});

// ✅ Update User Settings
export const updateUserSettings = asyncHandler(async (req, res) => {
  const { notifications, language } = req.body;
  const user = await User.findById(req.user._id);

  user.notifications = notifications;
  user.language = language;
  await user.save();

  res.json({ message: "Settings updated" });
});

// ✅ Forgot Password
export const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    console.log("🔍 Forgot Password Request for:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      res.status(404);
      throw new Error("User not found");
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log("🔗 Reset URL:", resetUrl);

    await sendResetEmail(
      user.email,
      "🔐 Reset Your VoyageAI Password",
      `<p>Click to reset your password:</p><a href="${resetUrl}">${resetUrl}</a><p>This link will expire in 15 minutes.</p>`
    );

    res.json({ message: "Reset link sent to your email" });

  } catch (error) {
    console.error("💥 Forgot Password Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }console.log("🕒 Token expires at:", new Date(user.resetPasswordExpires).toLocaleString());

});

// ✅ Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  user.password = await bcrypt.hash(req.body.newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successfully" });
});
