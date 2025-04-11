// middleware/uploadMiddleware.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ⚙️ Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "voyageai/profilePics", // 📁 Folder in your Cloudinary account
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 300, height: 300, crop: "fill" }],
    public_id: (req, file) => {
      // Optional: set custom public ID format
      return `user_${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, "")}`;
    },
  },
});

// 📤 Initialize multer with Cloudinary storage
const upload = multer({ storage });

export default upload;
