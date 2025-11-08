import express from "express";
import { getUserById, getAllUsers } from "../controllers/user.controller.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
