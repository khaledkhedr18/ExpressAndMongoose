import { NextFunction, Request, Response } from "express";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { AuthRequest } from "../middleware/auth.js";

/**
 * @desc Get the current user's wishlist
 * @route GET /api/wishlist
 * @access Private
 */
export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user?.userId;

  let wishlist = await Wishlist.findOne({ user: userId }).populate(
    "items.product",
    "name slug basePrice currency brand category variants ratings status",
  );

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, items: [] });
  }

  res.status(200).json({
    success: true,
    count: wishlist.items.length,
    data: wishlist,
  });
});

/**
 * @desc Add a product to the wishlist
 * @route POST /api/wishlist
 * @access Private
 */
export const addToWishlist = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    const alreadyExists = wishlist.items.some(
      (item) => item.product.toString() === productId,
    );

    if (alreadyExists) {
      return next(new AppError("Product is already in your wishlist", 400));
    }

    wishlist.items.push({ product: productId, addedAt: new Date() });
    await wishlist.save();

    await wishlist.populate(
      "items.product",
      "name slug basePrice currency brand category variants ratings status",
    );

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      count: wishlist.items.length,
      data: wishlist,
    });
  },
);

/**
 * @desc Remove a product from the wishlist
 * @route DELETE /api/wishlist/:productId
 * @access Private
 */
export const removeFromWishlist = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return next(new AppError("Wishlist not found", 404));
    }

    const itemIndex = wishlist.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return next(new AppError("Product not found in wishlist", 404));
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    await wishlist.populate(
      "items.product",
      "name slug basePrice currency brand category variants ratings status",
    );

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      count: wishlist.items.length,
      data: wishlist,
    });
  },
);

/**
 * @desc Clear the entire wishlist
 * @route DELETE /api/wishlist
 * @access Private
 */
export const clearWishlist = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return next(new AppError("Wishlist not found", 404));
    }

    wishlist.items = [] as any;
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Wishlist cleared",
      data: wishlist,
    });
  },
);
