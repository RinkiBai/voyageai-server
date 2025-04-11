import express from "express";
import { chatWithAI } from "../controllers/chatController.js"; // adjust path if needed

const router = express.Router();

router.post("/chat", chatWithAI);

export default router;
