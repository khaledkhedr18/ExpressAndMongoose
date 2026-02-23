import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { AuthRequest } from "../middleware/auth.js";
import { generateOtp, sendPasswordResetOtp } from "../utils/sendEmail.js";
import { appendFile } from "node:fs";

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, age } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError(`User with this email already exists`, 400));
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      age,
    });

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  },
);

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError(`Please provide email and password`, 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError(`Invalid email or password`, 401));
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return next(new AppError(`Invalid email or password`, 401));
    }

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  },
);

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const user = await User.findById(authReq.user?.userId);

    if (!user) {
      return next(new AppError(`User not found`, 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  },
);

/**
 * @desc    Update current user's password
 * @route   PATCH /api/auth/update-password
 * @access  Private
 */
export const updatePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authRequest = req as AuthRequest;

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return next(
        new AppError(`Please provide current password and new password`, 400),
      );
    }

    const user = await User.findById(authRequest.user?.userId).select(
      "+password",
    );

    if (!user) {
      return next(new AppError(`User not found`, 404));
    }

    const isCorrect = await user.comparePassword(currentPassword);

    if (!isCorrect) {
      return next(new AppError(`Current password is incorrect`, 401));
    }

    user.password = newPassword;
    await user.save();

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      token,
    });
  },
);

/**
 * @desc    Send password reset OTP to user's email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("No user found with this email address", 404));
    }

    const otp = generateOtp();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    user.passwordResetOtp = hashedOtp;
    user.passwordResetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetVerified = false;
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetOtp(email, otp);
    } catch (error) {
      user.passwordResetOtp = undefined;
      user.passwordResetOtpExpires = undefined;
      user.passwordResetVerified = false;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError("Failed to send reset email. Please try again later", 500),
      );
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to your email address",
    });
  },
);

/**
 * @desc    Verify the OTP sent to the user's email
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOtp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select(
      "+passwordResetOtp +passwordResetOtpExpires +passwordResetVerified",
    );

    if (!user) {
      return next(new AppError("No user found with this email address", 404));
    }

    if (!user.passwordResetOtp || !user.passwordResetOtpExpires) {
      return next(
        new AppError("No password reset was requested for this account", 400),
      );
    }

    if (user.passwordResetOtpExpires < new Date()) {
      user.passwordResetOtp = undefined;
      user.passwordResetOtpExpires = undefined;
      user.passwordResetVerified = false;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError("OTP has expired. Please request a new one", 400),
      );
    }

    const isOtpValid = await bcrypt.compare(otp, user.passwordResetOtp);
    if (!isOtpValid) {
      return next(new AppError("Invalid OTP", 400));
    }

    user.passwordResetVerified = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  },
);

/**
 * @desc    Reset password after OTP verification
 * @route   PATCH /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email }).select(
      "+passwordResetOtp +passwordResetOtpExpires +passwordResetVerified",
    );

    if (!user) {
      return next(new AppError("No user found with this email address", 404));
    }

    if (!user.passwordResetVerified) {
      return next(
        new AppError("OTP has not been verified. Please verify first", 400),
      );
    }

    user.password = newPassword;
    user.passwordResetOtp = undefined;
    user.passwordResetOtpExpires = undefined;
    user.passwordResetVerified = false;
    await user.save();

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      token,
    });
  },
);
