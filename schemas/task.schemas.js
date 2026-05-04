import Joi from "joi";
import { TASK_STATUSES, SORT_OPTIONS, MAX_LIMIT } from "../utils/task.constants.js";

// ─── Task body schemas ────────────────────────────────────────────────────────

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    "string.empty": "Title is required",
    "string.max": "Title cannot exceed 200 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().trim().max(2000).allow("").optional().messages({
    "string.max": "Description cannot exceed 2000 characters",
  }),
  status: Joi.string()
    .valid(...TASK_STATUSES)
    .optional()
    .messages({
      "any.only": `Status must be one of: ${TASK_STATUSES.join(", ")}`,
    }),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).optional().messages({
    "string.empty": "Title cannot be empty",
    "string.max": "Title cannot exceed 200 characters",
  }),
  description: Joi.string().trim().max(2000).allow("").optional().messages({
    "string.max": "Description cannot exceed 2000 characters",
  }),
  status: Joi.string()
    .valid(...TASK_STATUSES)
    .optional()
    .messages({
      "any.only": `Status must be one of: ${TASK_STATUSES.join(", ")}`,
    }),
})
  .min(1)
  .messages({
    "object.min": "No valid fields provided for update",
  });

// ─── Task query schema ────────────────────────────────────────────────────────

export const getTasksQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().messages({
    "number.base": "Page must be a number",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).max(MAX_LIMIT).optional().messages({
    "number.base": "Limit must be a number",
    "number.max": `Limit cannot exceed ${MAX_LIMIT}`,
  }),
  status: Joi.string()
    .valid(...TASK_STATUSES)
    .optional()
    .messages({
      "any.only": `Status must be one of: ${TASK_STATUSES.join(", ")}`,
    }),
  sort: Joi.string()
    .valid(...SORT_OPTIONS)
    .optional()
    .messages({
      "any.only": `Sort must be one of: ${SORT_OPTIONS.join(", ")}`,
    }),
  search: Joi.string().trim().max(100).optional().messages({
    "string.max": "Search term cannot exceed 100 characters",
  }),
});