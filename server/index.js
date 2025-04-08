import dotenv from "dotenv";
import express from "express";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/userModel.js";
import bcrypt from "bcryptjs";

dotenv.config();
const app = express();

// Connect to DB
connectDB();

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Listen on port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

// const createAdmin = async () => {
//   await mongoose.connect(process.env.MONGO_URI);

//   const existing = await User.findOne({ email: "admin@example.com" });
//   if (existing) {
//     console.log("Admin already exists.");
//     return process.exit();
//   }

//   const hashedPassword = await bcrypt.hash("password@1234", 10);

//   const adminUser = new User({
//     name: "Admin User",
//     email: "admin@example.com",
//     mobile: "9876543210",
//     password: hashedPassword,
//     role: "admin",
//     department: "administration",
//     status: "active",
//     lastLogin: null,
//   });

//   await adminUser.save();
//   console.log("✅ Admin created successfully!");
//   process.exit();
// };

// createAdmin();
