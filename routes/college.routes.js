import express from "express";
import {
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
} from "../controllers/college.controller.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllColleges);
router.get("/:id", getCollegeById);
router.put("/:id", updateCollege);
router.delete("/:id", deleteCollege);

export default router;
