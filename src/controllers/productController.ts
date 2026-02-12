import { NextFunction, Request, Response } from "express";
import Product from "../models/product.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

/**
 * @desc Get all products with filtering, sorting, pagination
 * @route GET /api/product
 * @access Public
 */

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { category, minPrice, maxPrice, sort, page, limit, search } = req.query;

  const filter: Record<string, unknown> = {};

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) {
      (filter.price as Record<string, Number>).$gte = Number(minPrice);
    }
    if (maxPrice) {
      (filter.price as Record<string, Number>).$lte = Number(maxPrice);
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

  const productsResult = await Product.find(filter)
    .sort(sort as string)
    .skip(skip)
    .limit(limitNum);

  const total = await Product.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: productsResult.length,
    total,
    appliedFilter: filter,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: productsResult,
  });
});

/**
 * @desc Get a certain product using its id.
 * @route GET /api/product/:id
 * @access Public
 */

export const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(
        new AppError(`Product with ID ${req.params.id} was not found`, 404),
      );
    }

    res.status(200).json({
      success: true,
      message: `Item with id: ${req.params.id} was found!`,
      data: product,
    });
  },
);

/**
 * @desc Create a new product.
 * @route POST /api/product
 * @access Public
 */

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.create(req.body);
    console.log(product);
    res.status(201).json({
      success: true,
      message: `Product created with name: ${product.name}`,
      data: product,
    });
  },
);

/**
 * @desc Delete a certain product using its id.
 * @route DELETE /api/product/:id
 * @access Public
 */

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(
        new AppError(`Couldn't find product with id: ${req.params}`, 404),
      );
    }

    res.status(200).json({
      success: true,
      message: `Product with id ${req.params.id} was deleted successfully`,
    });
  },
);

/**
 * @desc Update a certain product using its id.
 * @route PATCH /api/product/:id
 * @access Public
 */

export const updateProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(
        new AppError(`Couldn't find product with id: ${req.params}`, 404),
      );
    }

    res.status(200).json({
      success: true,
      message: `Product with id: ${req.params.id} was updated successfully!`,
      data: product,
    });
  },
);
