import mongoose from "mongoose";
import Task from "../models/task.model.js";
import {
  SORT_OPTIONS,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from "../utils/task.constants.js";

const sortMap = {
  latest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "a-z": { title: 1 },
  "z-a": { title: -1 },
};

export const getAllTasksService = async (userId, queryParams) => {
  const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, status, sort = "latest", search } = queryParams;

  const query = { userId };

  const trimmedSearch = search?.trim();
  if (trimmedSearch) {
    const escaped = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.title = { $regex: escaped, $options: "i" };
  }

  if (status) query.status = status;

  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || DEFAULT_LIMIT));
  const skip = (pageNumber - 1) * limitNumber;

  const sortOption = sortMap[sort] ?? sortMap.latest;

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
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    count: tasks.length,
    tasks,
  };
};

export const getTaskMetricsService = async (userId) => {
  const [result] = await Task.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $facet: {
        total: [{ $count: "n" }],
        completed: [{ $match: { status: "completed" } }, { $count: "n" }],
        inProgress: [{ $match: { status: "in-progress" } }, { $count: "n" }],
        pending: [{ $match: { status: "pending" } }, { $count: "n" }],
      },
    },
  ]);

  const total = result.total[0]?.n ?? 0;
  const completed = result.completed[0]?.n ?? 0;
  const inProgress = result.inProgress[0]?.n ?? 0;
  const pending = result.pending[0]?.n ?? 0;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return { total, completed, inProgress, pending, pct };
};

export const createTaskService = async ({ title, description, status, userId }) => {
  const task = await Task.create({
    title: title.trim(),
    description: description?.trim(),
    status,
    userId,
  });

  // Return only the fields the client needs — keeps the response shape consistent with getAllTasks
  return {
    _id: task._id,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt,
  };
};

export const updateTaskService = async (id, userId, updateData) => {
  const UPDATABLE = ["title", "description", "status"];
  const updateFields = Object.fromEntries(
    UPDATABLE.filter((k) => updateData[k] !== undefined).map((k) => {
      const val = updateData[k];
      return [k, typeof val === "string" ? val.trim() : val];
    })
  );

  const updatedTask = await Task.findOneAndUpdate(
    { _id: id, userId },
    updateFields,
    { new: true, runValidators: true }
  ).select("title description status createdAt");

  if (!updatedTask) {
    const err = new Error("Task not found or not authorized");
    err.statusCode = 404;
    throw err;
  }

  return updatedTask;
};

export const deleteTaskService = async (id, userId) => {
  const deleted = await Task.findOneAndDelete({ _id: id, userId });

  if (!deleted) {
    const err = new Error("Task not found or not authorized");
    err.statusCode = 404;
    throw err;
  }

  return true;
};