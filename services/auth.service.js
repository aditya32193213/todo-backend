import User from "../models/user.model.js";
import TokenBlacklist from "../models/tokenBlacklist.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

export const registerUserService = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email: normalizedEmail, password: hashedPassword });
  const token = generateToken(user._id);

  return { id: user._id, name: user.name, email: user.email, token };
};

export const loginUserService = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken(user._id);
  return { id: user._id, name: user.name, email: user.email, token };
};

export const logoutUserService = async (token) => {
    const decoded = jwt.decode(token);
  if (!decoded || !decoded.exp) {
    // Should not happen because middleware verified it, but safety net
    throw new Error("Invalid token for blacklisting");
  }
  const expiresAt = new Date(decoded.exp * 1000);

  try {
    await TokenBlacklist.create({ token, expiresAt });
  } catch (err) {
    if (err.code !== 11000) throw err; // ignore duplicate key
  }
};

export const updatePasswordService = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const err = new Error("Current password is incorrect");
    err.statusCode = 400;
    throw err;
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
};