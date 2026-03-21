import User from "../models/user.model.js";
import TokenBlacklist from "../models/tokenBlacklist.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

export const registerUserService = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email: normalizedEmail, password: hashedPassword });

  const token = generateToken(user._id);

  return { id: user._id, name: user.name, email: user.email, token };
};

export const loginUserService = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return { id: user._id, name: user.name, email: user.email, token };
};

export const logoutUserService = async (token) => {
  // Decode without verifying (already verified by protect middleware)
  // to extract the real expiry so the blacklist entry mirrors the token lifetime
  const decoded = jwt.decode(token);

  const expiresAt = new Date(decoded.exp * 1000); // UNIX timestamp → Date

  await TokenBlacklist.create({ token, expiresAt });
};