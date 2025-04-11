import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ✅ Test route
router.get("/test", (req, res) => {
  res.json({ message: "Auth test route working ✅" });
});

// Ensure uploads directory exists
const uploadDir = "uploads/profilePics";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage });

// ✅ Register with file upload
router.post("/register", upload.single("profilePic"), registerUser);

// ✅ Login
router.post("/login", loginUser);

export default router;
