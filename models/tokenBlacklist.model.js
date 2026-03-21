import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type:     String,
    required: true,
    // unique: true automatically creates a B-tree index — index: true removed
    // to avoid Mongoose creating a second, redundant index on the same field.
    unique:   true,
  },
  expiresAt: {
    type:     Date,
    required: true,
  },
});

// MongoDB TTL index: automatically deletes the document once expiresAt is reached.
// This keeps the blacklist lean — no manual cleanup needed.
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("TokenBlacklist", tokenBlacklistSchema);