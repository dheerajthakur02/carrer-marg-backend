import express from "express";
import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createCourse);
router.get("/", getAllCourses);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
