import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { AuthRequest } from "../middleware/auth.js";
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

    const user = await User.findOne({ email });
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
