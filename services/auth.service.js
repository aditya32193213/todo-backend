import User from "../models/user.model.js";
import TokenBlacklist from "../models/tokenBlacklist.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

// ── Register ──────────────────────────────────────────────────────────────
export const registerUserService = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // findOne to check existence — does not need the password hash, so the
  // select:false default is correct here. No .select("+password") needed.
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    // 409 Conflict — matches the status the 11000 duplicate-key handler in
    // error.middleware.js returns for the same scenario under a race condition.
    // Both sequential and concurrent duplicate-email paths now return 409.
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

// ── Login ─────────────────────────────────────────────────────────────────
export const loginUserService = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // FIX: user.model.js now has select:false on the password field so it is
  // excluded from every query by default. This findOne MUST opt back in with
  // .select("+password") because bcrypt.compare() needs user.password to
  // compare against. Without this, user.password would be undefined and
  // every login attempt would silently fail the bcrypt check.
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

// ── Logout ────────────────────────────────────────────────────────────────
// Called BEFORE localStorage is cleared on the client, so the token is still
// present in the Authorization header when the backend blacklists it.
export const logoutUserService = async (token) => {
  // Decode without verifying (already verified by protect middleware)
  // to extract the real expiry so the blacklist entry mirrors the token lifetime.
  const decoded   = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);

  await TokenBlacklist.create({ token, expiresAt });
};

// ── Update password ───────────────────────────────────────────────────────
// Requires the user's current password for verification before hashing the new one.
export const updatePasswordService = async (userId, { currentPassword, newPassword }) => {
  // .select("+password") opts in to the password hash for this one query.
  // This is the correct place — the only service function that needs the hash
  // after the initial login verification.
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