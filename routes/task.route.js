import express from "express";
import {
  getAllTasks,
  getTaskMetrics,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// IMPORTANT: /metrics must be registered BEFORE /:id so Express does not
// interpret the literal string "metrics" as a task ObjectId parameter.
router.get("/metrics", protect, getTaskMetrics);
router.get("/",    protect, getAllTasks);
router.post("/",   protect, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;