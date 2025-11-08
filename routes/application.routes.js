import express from "express";
import { authorize } from "../middlewares/authMiddleware.js";
import {
  studentApply,
  agentApply,
  getApplicationById,
  getAllApplications,
} from "../controllers/application.controller.js";

const router = express.Router();

router.post("/student/apply", authorize(["student"]), studentApply);
router.post("/agent/apply", authorize(["agent"]), agentApply);
router.get("/:id", getApplicationById);
router.get(
  "/",
  authorize(["agent", "student", "super-admin"]),
  getAllApplications
);

export default router;
