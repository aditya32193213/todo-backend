import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Name is required",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  // bcrypt silently truncates input beyond 72 bytes — cap here to prevent
  // two different long passwords hashing to the same value
  password: Joi.string().min(6).max(72).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password cannot exceed 72 characters",
    "any.required": "Password is required",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).max(72).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password cannot exceed 72 characters",
    "any.required": "Password is required",
  }),
});

export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().max(72).required().messages({
    "string.max": "Password cannot exceed 72 characters",
    "any.required": "Current password is required",
  }),
  newPassword: Joi.string().min(6).max(72).disallow(Joi.ref("currentPassword")).required().messages({
    "string.min": "New password must be at least 6 characters",
    "string.max": "Password cannot exceed 72 characters",
    "any.invalid": "New password must differ from current password",
    "any.required": "New password is required",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Please confirm your new password",
  }),
});