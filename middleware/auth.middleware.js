import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import TokenBlacklist from "../models/tokenBlacklist.model.js";

export const protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Extract token
      token = req.headers.authorization.split(" ")[1];

      // 3. Check if token has been blacklisted (i.e. user logged out)
      const isBlacklisted = await TokenBlacklist.exists({ token });
      if (isBlacklisted) {
        const err = new Error("Token has been invalidated. Please log in again.");
        err.statusCode = 401;
        return next(err);
      }

      // 4. Verify token signature and expiry
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 5. Get user from DB
      req.user = await User.findById(decoded.id).select("-password");

      // 6. Guard: user may have been deleted after token was issued
      if (!req.user) {
        const err = new Error("User no longer exists");
        err.statusCode = 401;
        return next(err);
      }

      // 7. All good — proceed
      return next();

    } catch (error) {
      const err = new Error("Not authorized, token failed");
      err.statusCode = 401;
      return next(err);
    }
  }

  // 8. No token provided
  if (!token) {
    const err = new Error("Not authorized, no token");
    err.statusCode = 401;
    return next(err);
  }
};