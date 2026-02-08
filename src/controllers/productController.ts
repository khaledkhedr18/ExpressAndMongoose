import { Request, Response } from "express";
import Product from "../models/product.js";

/**
 * @desc Get all products with filtering, sorting, pagination
 * @route GET /api/product
 * @access Public
 */

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice, sort, page, limit, search } =
      req.query;

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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Server Error ${error}`,
    });
  }
};

/**
 * @desc Get a certain product using its id.
 * @route GET /api/product/:id
 * @access Public
 */

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        error: `Couldn't find a product with ${req.params.id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Item with id: ${req.params.id} was found!`,
      data: product,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      res.status(400).json({ success: false, error: "Invalid ID format" });
      return;
    }
    res.status(500).json({
      success: false,
      error: "Server Error!",
    });
  }
};

/**
 * @desc Create a new product.
 * @route POST /api/product
 * @access Public
 */

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    console.log(product);
    res.status(201).json({
      success: true,
      message: `Product created with name: ${product.name}`,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Couldn't create the product. Please, Try Again Later!`,
    });
  }
};

/**
 * @desc Delete a certain product using its id.
 * @route DELETE /api/product/:id
 * @access Public
 */

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        error: `Product with id: ${req.params.id} not Found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Product with id ${req.params.id} was deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Server Error`,
    });
  }
};

/**
 * @desc Update a certain product using its id.
 * @route PATCH /api/product/:id
 * @access Public
 */

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      res.status(404).json({
        success: false,
        error: `Couldn't find a product with id ${req.params.id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Product with id: ${req.params.id} was updated successfully!`,
      data: product,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
};
