import { NextFunction, Request, Response } from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { AuthRequest } from "../middleware/auth.js";

/**
 * @desc Create a new order from the user's cart
 * @route POST /api/orders
 * @access Private
 */
export const createOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const { shippingAddress, payment, notes } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return next(
        new AppError("Cart is empty. Add items before placing an order", 400),
      );
    }

    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product);
      if (!product) {
        return next(
          new AppError(`Product "${cartItem.product}" no longer exists`, 404),
        );
      }

      const variant = product.variants.find(
        (v) => v.variantId === cartItem.variantId,
      );
      if (!variant) {
        return next(
          new AppError(
            `Variant "${cartItem.variantId}" no longer exists on product "${product.name}"`,
            404,
          ),
        );
      }

      const sizeEntry = variant.sizes.find((s) => s.size === cartItem.size);
      if (!sizeEntry) {
        return next(
          new AppError(
            `Size "${cartItem.size}" no longer available for "${product.name}" variant "${cartItem.variantId}"`,
            404,
          ),
        );
      }

      if (sizeEntry.stock < cartItem.quantity) {
        return next(
          new AppError(
            `Insufficient stock for "${product.name}" (${variant.color.name}, ${cartItem.size}). Only ${sizeEntry.stock} available`,
            400,
          ),
        );
      }

      orderItems.push({
        product: product._id,
        variantId: cartItem.variantId,
        color: variant.color.name,
        size: cartItem.size,
        quantity: cartItem.quantity,
        price: sizeEntry.price,
      });
    }

    const itemsTotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shippingCost = req.body.shippingCost || 0;
    const tax = req.body.tax || 0;
    const totalAmount = itemsTotal + shippingCost + tax;

    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      payment: {
        method: payment.method,
        status: payment.method === "cash_on_delivery" ? "pending" : "paid",
        transactionId: payment.transactionId || undefined,
        paidAt: payment.method !== "cash_on_delivery" ? new Date() : undefined,
      },
      itemsTotal,
      shippingCost,
      tax,
      totalAmount,
      status: "confirmed",
      notes,
    });

    for (const item of orderItems) {
      await Product.updateOne(
        {
          _id: item.product,
          "variants.variantId": item.variantId,
          "variants.sizes.size": item.size,
        },
        {
          $inc: {
            "variants.$[v].sizes.$[s].stock": -item.quantity,
          },
        },
        {
          arrayFilters: [
            { "v.variantId": item.variantId },
            { "s.size": item.size },
          ],
        },
      );
    }

    cart.items = [] as any;
    await cart.save();

    await order.populate(
      "items.product",
      "name slug basePrice currency brand category",
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  },
);

/**
 * @desc Get the current user's order history
 * @route GET /api/orders
 * @access Private
 */
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user?.userId;

  const features = new ApiFeatures(
    Order.find({ user: userId }),
    req.query as Record<string, string>,
  )
    .filter()
    .sort()
    .selectFields()
    .paginate();

  await features.countTotal();

  const orders = await features.query.populate(
    "items.product",
    "name slug basePrice currency brand category",
  );

  res.status(200).json({
    success: true,
    results: orders.length,
    total: features.total,
    data: orders,
  });
});

/**
 * @desc Get a single order by ID (receipt)
 * @route GET /api/orders/:id
 * @access Private
 */
export const getOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    const order = await Order.findOne({
      _id: req.params.id,
      user: userId,
    }).populate(
      "items.product",
      "name slug basePrice currency brand category variants",
    );

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  },
);

/**
 * @desc Get a single order by order number (receipt)
 * @route GET /api/orders/number/:orderNumber
 * @access Private
 */
export const getOrderByNumber = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
      user: userId,
    }).populate(
      "items.product",
      "name slug basePrice currency brand category variants",
    );

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  },
);

/**
 * @desc Cancel a pending or confirmed order
 * @route PATCH /api/orders/:id/cancel
 * @access Private
 */
export const cancelOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    const order = await Order.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      return next(
        new AppError(
          `Cannot cancel an order with status "${order.status}". Only pending or confirmed orders can be cancelled`,
          400,
        ),
      );
    }

    for (const item of order.items) {
      await Product.updateOne(
        {
          _id: item.product,
          "variants.variantId": item.variantId,
          "variants.sizes.size": item.size,
        },
        {
          $inc: {
            "variants.$[v].sizes.$[s].stock": item.quantity,
          },
        },
        {
          arrayFilters: [
            { "v.variantId": item.variantId },
            { "s.size": item.size },
          ],
        },
      );
    }

    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.cancellationReason = req.body.reason || "Cancelled by user";

    if (order.payment.status === "paid") {
      order.payment.status = "refunded";
    }

    await order.save();

    await order.populate(
      "items.product",
      "name slug basePrice currency brand category",
    );

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  },
);
