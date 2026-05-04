import {
  registerUserService,
  loginUserService,
  logoutUserService,
  updatePasswordService,
} from "../services/auth.service.js";


export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUserService({ name, email, password });
    res.status(201).json({ success: true, message: "User registered successfully", data: user });
  } catch (error) {
    next(error);
  }
};


export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await loginUserService({ email, password });
    res.status(200).json({ success: true, message: "User logged in successfully", data: user });
  } catch (error) {
    next(error);
  }
};


export const logoutUser = async (req, res, next) => {
  try {
    await logoutUserService(req.token);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};


export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await updatePasswordService(req.user._id, { currentPassword, newPassword });
    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};