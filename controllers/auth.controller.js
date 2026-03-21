import {
  registerUserService,
  loginUserService,
  logoutUserService,
  updatePasswordService,
} from "../services/auth.service.js";

// Basic email format check — shared by register and login
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Register ──────────────────────────────────────────────────────────────
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const user = await registerUserService({ name, email, password });
    res.status(201).json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    next(error);
  }
};

// ── Login ─────────────────────────────────────────────────────────────────
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const user = await loginUserService({ email, password });
    res.status(200).json({ success: true, message: "User logged in successfully", user });
  } catch (error) {
    next(error);
  }
};

// ── Logout ────────────────────────────────────────────────────────────────
export const logoutUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    await logoutUserService(token);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// ── Update password ───────────────────────────────────────────────────────
// Requires currentPassword for verification + newPassword + confirmPassword match.
// Validation is done here (controller layer) before reaching the service.
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword?.trim() || !newPassword?.trim() || !confirmPassword?.trim()) {
      return res.status(400).json({ success: false, message: "All password fields are required" });
    }

    if (newPassword.trim().length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    // Confirm match validated on backend as well — never rely solely on the client
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ success: false, message: "New password must differ from current password" });
    }

    await updatePasswordService(req.user._id, { currentPassword, newPassword });
    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};