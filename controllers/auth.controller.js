import {
  registerUserService,
  loginUserService,
  logoutUserService,
  updatePasswordService,
} from "../services/auth.service.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }


    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const user = await registerUserService({ name, email, password });
    res.status(201).json({ success: true, message: "User registered successfully", data: user });
  } catch (error) {
    next(error);
  }
};

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
    res.status(200).json({ success: true, message: "User logged in successfully", data: user });
  } catch (error) {
    next(error);
  }
};


export const logoutUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    await logoutUserService(token);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};


export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword?.trim() || !newPassword?.trim() || !confirmPassword?.trim()) {
      return res.status(400).json({ success: false, message: "All password fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

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