import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import ApiFeatures from "../utils/apiFeatures.js";

/**
 * @desc Get all users with filtering, sorting, and pagination.
 * @route GET /api/users
 * @access Public
 */
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const features = new ApiFeatures(
    User.find(),
    req.query as Record<string, string>,
  )
    .filter()
    .search(["firstName", "lastName", "email"])
    .sort()
    .selectFields()
    .paginate();

  await features.countTotal();

  const users = await features.query;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  res.status(200).json({
    success: true,
    count: users.length,
    total: features.total,
    page: page,
    pages: Math.ceil(features.total / limit),
    data: users,
  });
});

/**
 * @desc Get a single user by ID.
 * @route GET /api/users/:id
 * @access Public
 */
export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new AppError(`User with id: ${req.params.id} was not found!`, 404),
      );
    }

    res.status(200).json({
      success: true,
      message: `User with id: ${req.params.id} was found`,
      data: user,
    });
  },
);

/**
 * @desc Create a new user.
 * @route POST /api/users
 * @access Public
 */
export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(req.body);

    if (!user) {
      return next(
        new AppError(`User with id: ${req.params.id} was not found!`, 404),
      );
    }

    res.status(201).json({
      success: true,
      message: `User with Name: ${user.fullName} was Created Successfully`,
    });
  },
);

/**
 * @desc Delete a user by ID.
 * @route DELETE /api/users/:id
 * @access Public
 */
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return next(
        new AppError(`User with id: ${req.params.id} was not found!`, 404),
      );
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  },
);

/**
 * @desc Update a user by ID.
 * @route PATCH /api/users/:id
 * @access Public
 */
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(
        new AppError(`User with id: ${req.params.id} was not found!`, 404),
      );
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  },
);
