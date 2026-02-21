import { Router } from "express";
import {
  register,
  login,
  getMe,
  updatePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { get } from "node:http";

const router = Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (must be logged in)
router.get("/me", protect, getMe);
router.patch("/update-password", protect, updatePassword);

export default router;
