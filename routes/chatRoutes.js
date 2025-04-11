import express from "express";
import { chatWithAI } from "../controllers/chatController.js";
import { authenticateUser } from "../middleware/authMiddleware.js"; // ✅ Correct

const router = express.Router();

// If you want the chat to be protected:
router.post("/", authenticateUser, chatWithAI);

// Or if you want it public (remove the line above and uncomment below):
// router.post("/", chatWithAI);

export default router;
