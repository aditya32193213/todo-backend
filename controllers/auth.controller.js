import { registerUserService, loginUserService, logoutUserService } from "../services/auth.service.js";

// Basic email format check — shared by register and login
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Fix 1: trim check catches whitespace-only strings e.g. "   "
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Fix 2: reject malformed emails before hitting the DB
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // catch short passwords here for a clean 400 rather than a raw Mongoose error
    if (password.trim().length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const user = await registerUserService({ name, email, password });
    res.status(201).json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fix 1: trim check on login fields
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Fix 2: reject malformed emails before hitting the DB
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const user = await loginUserService({ email, password });
    res.status(200).json({ success: true, message: "User logged in successfully", user });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    // Extract raw token from Authorization header (already validated by protect middleware)
    const token = req.headers.authorization.split(" ")[1];
    await logoutUserService(token);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};