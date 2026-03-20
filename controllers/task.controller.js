import { getAllTasksService, createTaskService, updateTaskService, deleteTaskService } from "../services/task.service.js";
export const getAllTasks = async (req, res,next) => {
    try {
        const { page, limit, status, sort, search } = req.query;

        const result = await getAllTasksService(req.user._id, { page, limit, status, sort, search });
        
        res.status(200).json({ 
            success: true,
            message: "Tasks fetched successfully",
            ...result,
         });
    } catch (error) {
        next(error);
    }   };

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
        
        res.status(200).json({success: true, message: "Task updated successfully", task: updatedTask });
    }
 catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteTaskService(id, req.user._id);
        res.status(200).json({success: true, message: "Task deleted successfully" });
    } catch (error) {
        next(error);
    }
};
