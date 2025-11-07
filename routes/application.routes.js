import express from "express";
import { authorize } from "../middlewares/authMiddleware.js";
import {
  studentApply,
  agentApply,
  getStudentApplications,
  getAgentApplications,
} from "../controllers/application.controller.js";

const router = express.Router();

router.post("/student/apply", authorize(["student"]), studentApply);
router.post("/agent/apply", authorize(["agent"]), agentApply);
router.get(
  "/student/my-applications",
  authorize(["student"]),
  getStudentApplications
);
router.get("/agent/applications", authorize(["agent"]), getAgentApplications);

export default router;
