import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import TokenBlacklist from "../models/tokenBlacklist.model.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    const err = new Error("Not authorized, no token");
    err.statusCode = 401;
    return next(err);
  }

  const token = authHeader.split(" ")[1];

  try {
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const isBlacklisted = await TokenBlacklist.exists({ token });
    if (isBlacklisted) {
      const err = new Error("Session has been invalidated. Please log in again.");
      err.statusCode = 401;
      return next(err);
    }


    req.user = await User.findById(decoded.id);

    if (!req.user) {
      const err = new Error("The account associated with this token no longer exists.");
      err.statusCode = 401;
      return next(err);
    }

    next();
  } catch (error) {

    next(error);
  }
};