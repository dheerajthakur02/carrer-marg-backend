import express from "express";
import {
  getUserById,
  getAllUsers,
  getProfile,
} from "../controllers/user.controller.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/profile", authorize(), getProfile);
router.get("/:id", getUserById);

export default router;
