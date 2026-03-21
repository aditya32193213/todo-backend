import {
  getAllTasksService,
  getTaskMetricsService,
  createTaskService,
  updateTaskService,
  deleteTaskService,
} from "../services/task.service.js";

// All task endpoints return { success, message, data } for a consistent API shape.
export const getAllTasks = async (req, res, next) => {
  try {
    const { page, limit, status, sort, search } = req.query;
    const data = await getAllTasksService(req.user._id, { page, limit, status, sort, search });
    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskMetrics = async (req, res, next) => {
  try {
    const data = await getTaskMetricsService(req.user._id);
    res.status(200).json({ success: true, message: "Metrics fetched successfully", data });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = await createTaskService({
      title,
      description,
      status,
      userId: req.user._id,
    });
    res.status(201).json({ success: true, message: "Task created successfully", data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedTask = await updateTaskService(id, req.user._id, req.body);
    res.status(200).json({ success: true, message: "Task updated successfully", data: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteTaskService(id, req.user._id);
    // 204 No Content — the resource is gone; no body is expected or sent.
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};