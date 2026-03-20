import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index:true },
    },
    { timestamps: true }
);
export default mongoose.model("Task", TaskSchema);  