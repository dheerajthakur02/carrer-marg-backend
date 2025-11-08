import express from "express";
import {
  getAllStudents,
  updateStudentDetails,
  getStudentById,
} from "../controllers/student.controller.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authorize(["agent", "super-admin"]), getAllStudents);
router.get("/:id", updateStudentDetails);
router.get("/:id", getStudentById);
export default router;
