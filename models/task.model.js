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

TaskSchema.index({ userId: 1, status:    1  });
TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.index({ userId: 1, title:     1  });

export default mongoose.model("Task", TaskSchema);