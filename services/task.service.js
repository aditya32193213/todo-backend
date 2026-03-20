import mongoose from "mongoose";
import Task from "../models/task.model.js";

export const getAllTasksService = async (userId, queryParams) => 
    {
          const { page = 1, limit = 10, status, sort = "desc", search } = queryParams;

  // Build query
  const query = { userId };

  if (search) {
    query.title = { $regex: search, $options: "i" }; // Case-insensitive search
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
    const pageNumber= Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(50, Math.max(1, Number(limit) || 10));
    const skip = (pageNumber - 1) * limitNumber;

  // Sorting
  let sortOption = { createdAt: -1 };

    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "latest") sortOption = { createdAt: -1 };
    if (sort === "a-z") sortOption = { title: 1 };
    if (sort === "z-a") sortOption = { title: -1 };

  // Run queries in parallel (performance boost 🚀)
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
    
        if (!title) {
            const error = new Error("Title is required");
            error.statusCode = 400;
            throw error;
        }
        const task = await Task.create({
            title,
            description,
            status,
            userId
        });
        return task;
};

export const updateTaskService = async (id, userId, updateData) => {
        const { title, description, status } = updateData;

        const updateFields = {};
       
        if (title!==undefined) updateFields.title = title;
        if (description!==undefined) updateFields.description = description;
        if (status!==undefined) updateFields.status = status;

         if(Object.keys(updateFields).length === 0){
            const error = new Error("No valid fields provided for update");
            error.statusCode = 400;
            throw error;
        }
        

        const allowedStatus = ["pending", "in-progress", "completed"];
        if(updateData.status && !allowedStatus.includes(updateData.status)){
            const error = new Error("Invalid status value");
            error.statusCode = 400;
            throw error;
        }

        if(!mongoose.Types.ObjectId.isValid(id)){
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

  }

export const deleteTaskService = async (id, userId) => {
    if(!mongoose.Types.ObjectId.isValid(id)){
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
}