import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

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

      // 3. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Get user from DB (optional but good)
      req.user = await User.findById(decoded.id).select("-password");

      // 5. Move to next middleware/controller
      return next();

    } catch (error) {
    const err= new Error("Not authorized, token failed");
    err.statusCode = 401;
    return next(err);
    }
  }

  // 6. If no token
  if (!token) {
    const err= new Error("Not authorized, no token");
    err.statusCode = 401;
    return next(err);
  }
};