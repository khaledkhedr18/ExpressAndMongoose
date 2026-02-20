import { NextFunction, Request, Response } from "express";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import fs from "fs";
import path from "path";

/**
 * @desc Get all products with filtering, sorting, pagination
 * @route GET /api/product
 * @access Public
 */

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const features = new ApiFeatures(
    Product.find(),
    req.query as Record<string, string>,
  )
    .filter()
    .search(["name", "description"])
    .sort()
    .selectFields()
    .paginate();

  await features.countTotal();

  const products = await features.query;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  res.status(200).json({
    success: true,
    count: products.length,
    total: features.total,
    page,
    pages: Math.ceil(features.total / limit),
    data: products,
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
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.image) {
      req.body.image = files.image[0].filename;
    }

    if (files?.gallery) {
      req.body.images = files.gallery.map((file) => file.filename);
    }

    if (req.file) {
      req.body.image = req.file.filename;
    }

    const product = await Product.create(req.body);
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
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return next(new AppError("Product not found", 404));
    }

    if (req.file) {
      if (
        existingProduct.image &&
        existingProduct.image !== "default-product.png"
      ) {
        const oldImagePath = path.join(
          "uploads/products",
          existingProduct.image,
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      req.body.image = req.file.filename;
    }

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
