import { body, param, query } from "express-validator";

export const createOrderRules = [
  body("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required")
    .isObject()
    .withMessage("Shipping address must be an object"),

  body("shippingAddress.fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isString()
    .withMessage("Full name must be a string")
    .isLength({ max: 100 })
    .withMessage("Full name cannot exceed 100 characters"),

  body("shippingAddress.address")
    .notEmpty()
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string")
    .isLength({ max: 200 })
    .withMessage("Address cannot exceed 200 characters"),

  body("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string")
    .isLength({ max: 100 })
    .withMessage("City cannot exceed 100 characters"),

  body("shippingAddress.postalCode")
    .notEmpty()
    .withMessage("Postal code is required")
    .isString()
    .withMessage("Postal code must be a string")
    .isLength({ max: 20 })
    .withMessage("Postal code cannot exceed 20 characters"),

  body("shippingAddress.country")
    .notEmpty()
    .withMessage("Country is required")
    .isString()
    .withMessage("Country must be a string")
    .isLength({ max: 100 })
    .withMessage("Country cannot exceed 100 characters"),

  body("shippingAddress.phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isString()
    .withMessage("Phone number must be a string")
    .isLength({ max: 20 })
    .withMessage("Phone number cannot exceed 20 characters"),

  body("payment")
    .notEmpty()
    .withMessage("Payment information is required")
    .isObject()
    .withMessage("Payment must be an object"),

  body("payment.method")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["credit_card", "debit_card", "paypal", "cash_on_delivery"])
    .withMessage(
      "Payment method must be one of: credit_card, debit_card, paypal, cash_on_delivery",
    ),

  body("payment.transactionId")
    .optional()
    .isString()
    .withMessage("Transaction ID must be a string"),

  body("shippingCost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Shipping cost must be a non-negative number"),

  body("tax")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Tax must be a non-negative number"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string")
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

export const getOrderRules = [
  param("id")
    .isMongoId()
    .withMessage("Order ID must be a valid MongoDB ObjectId"),
];

export const getOrderByNumberRules = [
  param("orderNumber")
    .notEmpty()
    .withMessage("Order number is required")
    .isString()
    .withMessage("Order number must be a string"),
];

export const cancelOrderRules = [
  param("id")
    .isMongoId()
    .withMessage("Order ID must be a valid MongoDB ObjectId"),

  body("reason")
    .optional()
    .isString()
    .withMessage("Cancellation reason must be a string")
    .isLength({ max: 500 })
    .withMessage("Cancellation reason cannot exceed 500 characters"),
];

export const getOrdersQueryRules = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sort").optional().isString().withMessage("Sort must be a string"),

  query("status")
    .optional()
    .isIn([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ])
    .withMessage(
      "Status must be one of: pending, confirmed, processing, shipped, delivered, cancelled",
    ),
];
