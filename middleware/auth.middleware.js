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
    // 1. Verify signature and expiry — CPU-only, no DB hit.
    //    jwt.verify throws named errors on failure:
    //      TokenExpiredError  — token was valid but exp < Date.now()
    //      JsonWebTokenError  — bad signature, malformed, or wrong secret
    //    Doing this FIRST means expired/malformed tokens are rejected without
    //    touching the database. Only valid, non-expired tokens reach step 2.
    //    Both errors are forwarded via next(error) so error.middleware.js
    //    can identify them by name and return distinct messages.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Reject tokens that were explicitly invalidated at logout.
    //    Runs AFTER jwt.verify so the DB is only queried for tokens that are
    //    cryptographically valid — expired/malformed traffic is already gone.
    //    The TTL index on TokenBlacklist auto-expires entries when the JWT
    //    itself expires, so the collection stays lean with no manual cleanup.
    const isBlacklisted = await TokenBlacklist.exists({ token });
    if (isBlacklisted) {
      const err = new Error("Session has been invalidated. Please log in again.");
      err.statusCode = 401;
      return next(err);
    }

    // 3. Confirm the account still exists.
    //    user.model.js has select:false on the password field, so the hash is
    //    excluded from every findById/findOne by default — no .select() needed.
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