// routes/agent.routes.js
import express from "express";
import { authorize } from "../middlewares/authMiddleware.js";
import {
  getUnassignedStudents,
  assignStudentToAgent,
  getAssignedStudents,
  getAssignedApplications,
} from "../controllers/agent.controller.js";

const router = express.Router();

// 🔍 Get students not assigned to any agent
router.get("/students/unassigned", authorize(["agent"]), getUnassignedStudents);

// ➕ Assign a student to this agent
router.post(
  "/students/assign/:studentId",
  authorize(["agent"]),
  assignStudentToAgent
);

// 📋 Get all students assigned to this agent
router.get("/students", authorize(["agent"]), getAssignedStudents);

// 🧾 Get all applications of assigned students
router.get("/applications", authorize(["agent"]), getAssignedApplications);

export default router;
