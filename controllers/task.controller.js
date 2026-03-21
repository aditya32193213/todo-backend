import {
  getAllTasksService,
  getTaskMetricsService,
  createTaskService,
  updateTaskService,
  deleteTaskService,
} from "../services/task.service.js";

// FIX: Previously this spread result directly into the response root:
//   { success, message, total, page, pages, count, tasks }
// Every other endpoint nests its payload under a named key
//   (task, user, metrics). The fix nests the paginated result under
//   a `data` key so the entire API shares one consistent shape:
//   { success, message, data: { ... } }
//
// ⚠ FRONTEND IMPACT: todoService.js must be updated from
//   return res.data          →  return res.data.data
// See the paired todoService.js fix delivered alongside this file.
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
    const metrics = await getTaskMetricsService(req.user._id);
    res.status(200).json({ success: true, metrics });
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
    res.status(201).json({ success: true, message: "Task created successfully", task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedTask = await updateTaskService(id, req.user._id, req.body);
    res.status(200).json({ success: true, message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteTaskService(id, req.user._id);
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};