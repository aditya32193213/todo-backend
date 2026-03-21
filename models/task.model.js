import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: true,
      trim:     true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type:    String,
      enum:    ["pending", "in-progress", "completed"],
      default: "pending",
    },
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────
//
// Single-field index on userId alone covers the base case (fetch all tasks
// for a user) but forces MongoDB to scan every matching userId document
// whenever a filter (status) or sort (createdAt) is added.
//
// Compound indexes extend that coverage to the two most common access patterns
// in this API:
//
//   { userId: 1, status: 1 }
//     Covers:  GET /tasks?status=pending|in-progress|completed
//     Without: MongoDB scans all userId documents, then filters in memory.
//     With:    MongoDB jumps directly to the (userId, status) bucket.
//
//   { userId: 1, createdAt: -1 }
//     Covers:  GET /tasks sorted by latest (default) or oldest
//     Without: MongoDB fetches all userId documents, then sorts in memory (SORT stage).
//     With:    Documents arrive pre-sorted from the index — no in-memory sort.
//
// MongoDB uses the leftmost prefix rule: a query on userId alone still hits
// both compound indexes, so the separate single-field index on userId is
// intentionally removed to avoid maintaining a redundant index.
// The two compound indexes below fully replace it.

TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Task", TaskSchema);