import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updatePassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
} from "../schemas/auth.schemas.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/logout", protect, logoutUser);
router.patch("/password", protect, validate(updatePasswordSchema), updatePassword);

export default router;