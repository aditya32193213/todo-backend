import mongoose from "mongoose";

// Rejects requests with a malformed :id before they reach the DB.
// Saves a round-trip and avoids the CastError path in the error handler.
const validateObjectId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }
  next();
};

export default validateObjectId;