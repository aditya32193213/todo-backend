import jwt from 'jsonwebtoken';

// JWT_EXPIRES_IN is validated at startup in server.js — no fallback needed here.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

export default generateToken;