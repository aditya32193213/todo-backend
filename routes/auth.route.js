import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updatePassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login",    loginUser);
router.post("/logout",   protect, logoutUser);
router.patch("/password",  protect, updatePassword);

export default router;