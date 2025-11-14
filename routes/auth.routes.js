import express from "express";
import {
  register,
  loginWithPassword,
  logout,
} from "../controllers/auth.controller.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", authorize(), register);
router.post("/login", loginWithPassword);
router.get("/logout", authorize(), logout);
export default router;
