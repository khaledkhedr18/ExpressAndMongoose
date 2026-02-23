import { body, param } from "express-validator";

export const addToCartRules = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),

  body("variantId")
    .notEmpty()
    .withMessage("Variant ID is required")
    .isString()
    .withMessage("Variant ID must be a string"),

  body("size")
    .notEmpty()
    .withMessage("Size is required")
    .isString()
    .withMessage("Size must be a string"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

export const updateCartItemRules = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),

  body("variantId")
    .notEmpty()
    .withMessage("Variant ID is required")
    .isString()
    .withMessage("Variant ID must be a string"),

  body("size")
    .notEmpty()
    .withMessage("Size is required")
    .isString()
    .withMessage("Size must be a string"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer (0 to remove)"),
];

export const removeFromCartRules = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),

  body("variantId")
    .notEmpty()
    .withMessage("Variant ID is required")
    .isString()
    .withMessage("Variant ID must be a string"),

  body("size")
    .notEmpty()
    .withMessage("Size is required")
    .isString()
    .withMessage("Size must be a string"),
];
