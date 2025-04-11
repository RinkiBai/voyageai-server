import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// ✅ Test route
router.get("/test", (req, res) => {
  res.json({ message: "Auth test route working ✅" });
});

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profilePics/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage });

router.post("/register", upload.single("profilePic"), registerUser);
router.post("/login", loginUser);

export default router;
