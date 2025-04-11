// seedUsers.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany(); // Optional: clears existing users

    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        role: "user",
      },
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      },
    ];

    await User.insertMany(users);
    console.log("✅ Test users seeded!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
};

seedUsers();
