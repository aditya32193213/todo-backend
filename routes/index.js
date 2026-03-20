import express from "express";
import AuthRoutes from "./auth.routes.js";
import TaskRoutes from "./tasks.route.js";

const router = express.Router();
router.use('/auth', AuthRoutes);
router.use('/tasks', TaskRoutes);

export default router;