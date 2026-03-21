import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import TokenBlacklist from "../models/tokenBlacklist.model.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Reject immediately if the Authorization header is absent or malformed.
  if (!authHeader?.startsWith("Bearer ")) {
    const err = new Error("Not authorized, no token");
    err.statusCode = 401;
    return next(err);
  }

  const token = authHeader.split(" ")[1];

  try {
    // 1. Reject tokens that were explicitly invalidated at logout.
    //    The TTL index on TokenBlacklist auto-expires entries when the JWT
    //    itself expires, so the collection stays lean with no manual cleanup.
    const isBlacklisted = await TokenBlacklist.exists({ token });
    if (isBlacklisted) {
      const err = new Error("Session has been invalidated. Please log in again.");
      err.statusCode = 401;
      return next(err);
    }

    // 2. Verify signature and expiry.
    //    jwt.verify throws named errors on failure:
    //      TokenExpiredError  — token was valid but exp < Date.now()
    //      JsonWebTokenError  — bad signature, malformed, or wrong secret
    //    Both are forwarded directly via next(error) so error.middleware.js
    //    can identify them by name and return distinct messages.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Confirm the account still exists.
    //    FIX: .select("-password") removed — user.model.js already has
    //    select:false on the password field, so the hash is excluded from
    //    every findById/findOne by default. The explicit exclusion was
    //    redundant and left readers wondering if there was a reason for it.
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      const err = new Error("The account associated with this token no longer exists.");
      err.statusCode = 401;
      return next(err);
    }

    next();
  } catch (error) {
    // Forward the original JWT error — do NOT wrap it.
    // Wrapping creates a new Error and destroys err.name, making
    // TokenExpiredError and JsonWebTokenError indistinguishable.
    next(error);
  }
};