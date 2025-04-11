import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// ✅ Route imports
import chatRoutes from "./routes/chatRoutes.js";
import searchRoutes from "./routes/search.js";
import subscribeRoute from "./routes/subscribe.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize Express app
const app = express();

// ✅ Proper CORS configuration
app.use(cors({
  origin: "http://localhost:5173", // Allow Vite frontend
  credentials: true                // Needed for cookies/auth headers
}));

app.use(express.json()); // For parsing JSON request bodies

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ API Routes
app.use("/api/chat", chatRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/subscribe", subscribeRoute);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// ✅ Root
app.get("/", (req, res) => {
  res.send("🌍 VoyageAI API is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
