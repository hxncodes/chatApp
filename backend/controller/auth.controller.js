import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookies from "../utils/generateTokens.js";

// Sign up user
export const signup = async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body;

    // Validate passwords
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists. Please login." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate user avatar URL based on gender
    const avatarUrl =
      gender === "male"
        ? `https://avatar.iran.liara.run/public/boy?username=${userName}`
        : `https://avatar.iran.liara.run/public/girl?username=${userName}`;

    // Create and save the new user
    const newUser = new User({
      fullName,
      userName,
      password: hashedPassword,
      gender,
      avatar: avatarUrl,
    });

    await newUser.save();

    // Generate and set the JWT token in a secure cookie
    generateTokenAndSetCookies(newUser._id, res);

    // Respond with the user data (excluding sensitive info)
    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      userName: newUser.userName,
      avatar: newUser.avatar,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Validate password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate and set the JWT token
    generateTokenAndSetCookies(user._id, res);

    // Send user details (excluding sensitive information)
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Logout user by clearing the JWT cookie
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true, // Ensure it’s not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
      sameSite: "Strict", // Mitigate CSRF
      path: "/", // Clear the cookie for the root path
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
