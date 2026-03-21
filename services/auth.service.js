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
    error.statusCode = 409;
    throw error;
  }

  const salt           = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user  = await User.create({ name, email: normalizedEmail, password: hashedPassword });
  const token = generateToken(user._id);

  return { id: user._id, name: user.name, email: user.email, token };
};


export const loginUserService = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

 
  const user = await User.findOne({ email: normalizedEmail }).select("+password");
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

  const decoded   = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);

  await TokenBlacklist.create({ token, expiresAt });
};


export const updatePasswordService = async (userId, { currentPassword, newPassword }) => {

  const user = await User.findById(userId).select("+password");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  const salt    = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
};