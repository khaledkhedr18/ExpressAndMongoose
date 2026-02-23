import { Router } from "express";
import {
  register,
  login,
  getMe,
  updatePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/authController.js";
import {
  forgotPasswordRules,
  verifyOtpRules,
  resetPasswordRules,
} from "../middleware/validators/authValidator.js";
import validate from "../middleware/validators/validate.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPasswordRules, validate, forgotPassword);
router.post("/verify-otp", verifyOtpRules, validate, verifyOtp);
router.patch("/reset-password", resetPasswordRules, validate, resetPassword);

// Protected routes (must be logged in)
router.get("/me", protect, getMe);
router.patch("/update-password", protect, updatePassword);

export default router;
