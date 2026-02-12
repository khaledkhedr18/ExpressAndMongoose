// src/middleware/validators/productValidator.ts

import { body, param, query } from "express-validator";

export const createProductRules = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name must be a string")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["electronics", "furniture", "clothing", "books", "other"])
    .withMessage("Invalid category"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("inStock")
    .optional()
    .isBoolean()
    .withMessage("inStock must be a boolean"),
];

export const updateProductRules = [
  body("name")
    .optional()
    .isString()
    .withMessage("Product name must be a string")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("category")
    .optional()
    .isIn(["electronics", "furniture", "clothing", "books", "other"])
    .withMessage("Invalid category"),

  body("description")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("inStock")
    .optional()
    .isBoolean()
    .withMessage("inStock must be a boolean"),
];

export const getProductRules = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
];

export const getProductsQueryRules = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("minPrice must be a positive number"),

  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("maxPrice must be a positive number"),

  query("sort")
    .optional()
    .isIn(["price", "-price", "name", "-name", "createdAt", "-createdAt"])
    .withMessage("Invalid sort option"),
];
