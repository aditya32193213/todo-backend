import mongoose from "mongoose";
import Task from "../models/task.model.js";

export const getAllTasksService = async (userId, queryParams) => {
  // Fix 4: changed default sort from "desc" → "latest" to match sort logic
  const { page = 1, limit = 10, status, sort = "latest", search } = queryParams;

  // Build query
  const query = { userId };

  // trim first — whitespace-only search ("   ") is treated as no search
  const trimmedSearch = search?.trim();
  if (trimmedSearch) {
    // escape user input before using in regex to prevent ReDoS
    const escaped = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.title = { $regex: escaped, $options: "i" };
  }

  if (status) {
    const allowedStatus = ["pending", "in-progress", "completed"];

    if (!allowedStatus.includes(status)) {
      const error = new Error("Invalid status value");
      error.statusCode = 400;
      throw error;
    }

    query.status = status;
  }

  // Pagination setup
  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (pageNumber - 1) * limitNumber;

  // Sorting
  let sortOption = { createdAt: -1 }; // default: latest

  if (sort === "oldest") sortOption = { createdAt: 1 };
  if (sort === "latest") sortOption = { createdAt: -1 };
  if (sort === "a-z") sortOption = { title: 1 };
  if (sort === "z-a") sortOption = { title: -1 };

  // Run queries in parallel
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


export const createTaskService = async ({ title, description, status, userId }) => {
  // trim first so whitespace-only strings ("   ") are treated as empty
  if (!title?.trim()) {
    const error = new Error("Title is required");
    error.statusCode = 400;
    throw error;
  }
  const task = await Task.create({
    title: title.trim(),
    description: description?.trim(),
    status,
    userId,
  });
  return task;
};

export const updateTaskService = async (id, userId, updateData) => {
  const { title, description, status } = updateData;

  const updateFields = {};

  if (title !== undefined) {
    // reject whitespace-only titles on update just like on create
    if (!title.trim()) {
      const error = new Error("Title cannot be empty");
      error.statusCode = 400;
      throw error;
    }
    updateFields.title = title.trim();
  }

  if (description !== undefined) updateFields.description = description.trim();

  if (status !== undefined) {
    // Fix 3: validate status BEFORE adding to updateFields — keeps intent clear
    // and prevents an invalid value ever entering updateFields even momentarily
    const allowedStatus = ["pending", "in-progress", "completed"];
    if (!allowedStatus.includes(status)) {
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid task ID");
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