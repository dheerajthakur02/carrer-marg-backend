import express from "express";
import {
  register,
  loginWithPassword,
  logout,
  getProfile,
} from "../controllers/auth.controller.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", loginWithPassword);
router.get("/logout", authorize(), logout);
router.get("/profile", authorize(), getProfile);
export default router;
