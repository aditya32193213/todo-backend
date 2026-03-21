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
// Three compound indexes cover every query pattern in this API.
// MongoDB's leftmost-prefix rule means a query on userId alone hits all three,
// so no separate single-field index on userId is needed.
//
//   { userId: 1, status: 1 }
//     Covers:  GET /tasks?status=pending|in-progress|completed
//     Without: Full scan of all userId docs, then in-memory filter.
//     With:    Index seek directly to the (userId, status) bucket.
//
//   { userId: 1, createdAt: -1 }
//     Covers:  GET /tasks sorted by latest (default) or oldest
//     Without: Full scan + in-memory SORT stage.
//     With:    Documents arrive pre-sorted — no in-memory sort.
//
//   { userId: 1, title: 1 }
//     Covers:  GET /tasks?sort=a-z and sort=z-a
//     Without: { userId, createdAt } index used for the userId match,
//              then every matched document sorted in memory by title.
//     With:    Index already orders documents by title for that user.

TaskSchema.index({ userId: 1, status:    1  });
TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.index({ userId: 1, title:     1  });

export default mongoose.model("Task", TaskSchema);