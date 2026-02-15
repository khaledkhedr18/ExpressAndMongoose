import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { role, search, limit, sort, page, minAge, maxAge } = req.query;
  let filter: Record<string, unknown> = {};

  if (role) {
    filter.role = role;
  }

  if (minAge || maxAge) {
    if (minAge) {
      (filter.age as Record<string, Number>).$gte = Number(minAge);
    }
    if (maxAge) {
      (filter.age as Record<string, Number>).$lte = Number(maxAge);
    }
  }

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 0;
  const skip = (pageNum - 1) * limitNum;

  const users = await User.find(filter)
    .sort(sort as string)
    .limit(limitNum)
    .skip(skip);

  const total = await User.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: users,
    count: users.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  });
});

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
