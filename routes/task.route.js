import express from "express";
import {
  getAllTasks,
  getTaskMetrics,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import validateObjectId from "../middleware/validateObjectId.middleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
  getTasksQuerySchema,
} from "../schemas/task.schemas.js";

const router = express.Router();

// /metrics must sit above /:id so Express doesn't treat "metrics" as an id param
router.get("/metrics", protect, getTaskMetrics);
router.get("/", protect, validate(null, getTasksQuerySchema), getAllTasks);
router.post("/", protect, validate(createTaskSchema), createTask);


router.put("/:id", protect, validateObjectId, validate(updateTaskSchema), updateTask);
router.delete("/:id", protect, validateObjectId, deleteTask);

export default router;