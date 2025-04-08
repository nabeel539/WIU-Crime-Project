import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// User Signup
export const signupUser = async (req, res) => {
  const { name, email, mobile, password, role } = req.body;

  try {
    // Check if User already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Validate role
    if (!role || !["officer", "investigator"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be either 'officer' or 'investigator'",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new User
    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      role,
    });

    // Save User to the database
    await newUser.save();

    // Create token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.status(201).json({
      success: true,
      message: "Signup Successful",
      token,
      role: newUser.role,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if User exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: existingUser.role,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
