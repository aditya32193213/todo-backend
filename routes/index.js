import express from "express";
import AuthRoutes from "./auth.route.js";
import TaskRoutes from "./task.route.js";

const router = express.Router();
router.use('/auth', AuthRoutes);
router.use('/tasks', TaskRoutes);

export default router;