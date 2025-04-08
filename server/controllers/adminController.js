import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin email matches the predefined admin email
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: "Invalid Email" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Respond with success and token
    return res.status(200).json({ success: true, token, role: "admin" });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Add Users
export const addUser = async (req, res) => {
  try {
    const { name, email, mobile, password, role, department, status } =
      req.body;

    // === Field Validations ===
    if (!name || !email || !mobile || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format." });
    }

    // Mobile format check (Indian mobile example: 10 digits, starts with 6-9)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid mobile number." });
    }

    // Password strength (at least 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Role validation (in case frontend sends invalid data)
    const validRoles = ["admin", "officer", "investigator"];
    if (!validRoles.includes(role)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid role specified." });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role,
      department: department || "General",
      status: status || "active",
      lastLogin: null,
    });

    // Send response
    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user,
      // id: user._id.toString(),
      // name: user.name,
      // email: user.email,
      // role: user.role,
      // department: user.department,
      // status: user.status,
      // lastLogin: user.lastLogin,
    });
  } catch (err) {
    console.error("Add user error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// get all users
export const getAllUsers = async (req, res) => {
  try {
    // Only admins should reach here due to adminProtect middleware
    const users = await User.find().select("-password");

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users. Try again later.",
    });
  }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Don't allow editing admins
    if (user.role === "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Cannot edit admin user" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update User by ID
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (existingUser.role === "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Cannot edit admin user" });
    }

    const { firstName, lastName, email, mobile, role, department } = req.body;

    const fullName = `${firstName} ${lastName}`;

    await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name: fullName,
          email,
          mobile,
          role,
          department,
        },
      },
      { new: true, runValidators: true } // ensure validation for other fields
    );

    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
