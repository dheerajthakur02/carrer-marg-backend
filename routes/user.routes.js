import express from "express";
import {
  getUserById,
  getAllUsers,
  getProfile,
} from "../controllers/user.controller.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authorize(["super-admin", "agent"]), getAllUsers);
router.get("/profile", authorize(), getProfile);
router.get("/:id", authorize(), getUserById);

export default router;
