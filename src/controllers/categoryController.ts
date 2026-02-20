import Category from "../models/Category.js";
import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { NextFunction, Request, Response } from "express";

/**
 * @desc Get all categories with filtering, sorting, and pagination.
 * @route GET /api/categories
 * @access Public
 */
export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const { sort, page, limit, search } = req.query;
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const limitNum = parseInt(limit as string) || 20;
    const pageNum = parseInt(page as string) || 1;
    const skip = (pageNum - 1) * limitNum;

    const categoryResults = await Category.find(filter)
      .skip(skip)
      .sort((sort as string) || "-createdAt")
      .limit(limitNum);

    const total = await Category.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: categoryResults.length,
      total,
      appliedFilter: filter,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: categoryResults,
    });
  },
);

/**
 * @desc Get a single category by ID.
 * @route GET /api/categories/:id
 * @access Public
 */
export const getCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(
        new AppError(`Category with id: ${req.params.id} was not found!`, 404),
      );
    }

    res.status(200).json({
      success: true,
      message: `Category with id: ${req.params.id} was found!`,
      data: category,
    });
  },
);

/**
 * @desc Create a new category.
 * @route POST /api/categories
 * @access Public
 */
export const createCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      message: `Category with name: ${category.name} was created`,
      data: category,
    });
  },
);

/**
 * @desc Update a category by ID.
 * @route PATCH /api/categories/:id
 * @access Public
 */
export const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return next(
        new AppError(`Couldn't find product with id ${req.params.id}`, 404),
      );
    }

    res.status(200).json({
      success: true,
      message: `Product with id: ${req.params.id} was updated successfully`,
      data: category,
    });
  },
);

/**
 * @desc Delete a category by ID.
 * @route DELETE /api/categories/:id
 * @access Public
 */
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return next(
        new AppError(`Category with id: ${req.params.id} was not found!`, 404),
      );
    }

    res.status(200).json({
      success: true,
      message: `Category with id: ${req.params.id} was deleted successfully`,
    });
  },
);
