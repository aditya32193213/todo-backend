import mongoose from "mongoose";
import Task from "../models/task.model.js";

// ── Allowed values ────────────────────────────────────────────────────────
const ALLOWED_STATUS = ["pending", "in-progress", "completed"];

// ── Get all tasks (paginated + filtered) ─────────────────────────────────
export const getAllTasksService = async (userId, queryParams) => {
  const { page = 1, limit = 10, status, sort = "latest", search } = queryParams;

  const query = { userId };

  const trimmedSearch = search?.trim();
  if (trimmedSearch) {
    const escaped = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.title = { $regex: escaped, $options: "i" };
  }

  if (status) {
    if (!ALLOWED_STATUS.includes(status)) {
      const error = new Error("Invalid status value");
      error.statusCode = 400;
      throw error;
    }
    query.status = status;
  }

  const pageNumber  = Math.max(1, Number(page)  || 1);
  const limitNumber = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip        = (pageNumber - 1) * limitNumber;

  let sortOption = { createdAt: -1 };
  if (sort === "oldest") sortOption = { createdAt:  1 };
  if (sort === "a-z")    sortOption = { title:       1 };
  if (sort === "z-a")    sortOption = { title:      -1 };

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .select("title description status createdAt")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    Task.countDocuments(query),
  ]);

  return {
    total,
    page:  pageNumber,
    pages: Math.ceil(total / limitNumber),
    count: tasks.length,
    tasks,
  };
};

// ── Metrics: single DB round-trip via aggregation ─────────────────────────
export const getTaskMetricsService = async (userId) => {
  const [result] = await Task.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $facet: {
        total:      [{ $count: "n" }],
        completed:  [{ $match: { status: "completed"   } }, { $count: "n" }],
        inProgress: [{ $match: { status: "in-progress" } }, { $count: "n" }],
        pending:    [{ $match: { status: "pending"     } }, { $count: "n" }],
      },
    },
  ]);

  const total      = result.total[0]?.n      ?? 0;
  const completed  = result.completed[0]?.n  ?? 0;
  const inProgress = result.inProgress[0]?.n ?? 0;
  const pending    = result.pending[0]?.n    ?? 0;
  const pct        = total ? Math.round((completed / total) * 100) : 0;

  return { total, completed, inProgress, pending, pct };
};

// ── Create task ───────────────────────────────────────────────────────────
export const createTaskService = async ({ title, description, status, userId }) => {
  if (!title?.trim()) {
    const error = new Error("Title is required");
    error.statusCode = 400;
    throw error;
  }

  // Explicit status check before hitting the DB — consistent with
  // updateTaskService which validates status at the service layer.
  // Without this, an invalid value reaches Task.create(), triggers
  // the Mongoose enum validator, and surfaces as a ValidationError
  // with a generic Mongoose message instead of a targeted 400.
  // status is optional (the model defaults to "pending"), so only
  // validate when the caller actually supplies a value.
  if (status !== undefined && !ALLOWED_STATUS.includes(status)) {
    const error = new Error("Invalid status value");
    error.statusCode = 400;
    throw error;
  }

  const task = await Task.create({
    title:       title.trim(),
    description: description?.trim(),
    status,
    userId,
  });
  return task;
};

// ── Update task ───────────────────────────────────────────────────────────
export const updateTaskService = async (id, userId, updateData) => {
  // Validate ID first — reject invalid values before building update fields.
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid task ID");
    error.statusCode = 400;
    throw error;
  }

  const { title, description, status } = updateData;
  const updateFields = {};

  if (title !== undefined) {
    if (!title.trim()) {
      const error = new Error("Title cannot be empty");
      error.statusCode = 400;
      throw error;
    }
    updateFields.title = title.trim();
  }

  if (description !== undefined) updateFields.description = description.trim();

  if (status !== undefined) {
    if (!ALLOWED_STATUS.includes(status)) {
      const error = new Error("Invalid status value");
      error.statusCode = 400;
      throw error;
    }
    updateFields.status = status;
  }

  if (Object.keys(updateFields).length === 0) {
    const error = new Error("No valid fields provided for update");
    error.statusCode = 400;
    throw error;
  }

  const updatedTask = await Task.findOneAndUpdate(
    { _id: id, userId },
    updateFields,
    { new: true, runValidators: true }
  );

  if (!updatedTask) {
    const error = new Error("Task not found or not authorized");
    error.statusCode = 404;
    throw error;
  }

  return updatedTask;
};

// ── Delete task ───────────────────────────────────────────────────────────
export const deleteTaskService = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid task ID");
    error.statusCode = 400;
    throw error;
  }

  const deletedTask = await Task.findOneAndDelete({ _id: id, userId });

  if (!deletedTask) {
    const error = new Error("Task not found or not authorized");
    error.statusCode = 404;
    throw error;
  }

  return true;
};