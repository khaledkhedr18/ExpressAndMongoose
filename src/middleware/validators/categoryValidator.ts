import { body, param, query } from "express-validator";

export const createCategoryRules = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isString()
    .withMessage("Category name must be a string")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters"),
];

export const updateCategoryRules = [
  body("name")
    .optional()
    .isString()
    .withMessage("Category name must be a string")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters"),
];

export const getCategoryRules = [
  param("id").isMongoId().withMessage("Invalid category ID format"),
];

export const getCategoriesQueryRules = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sort")
    .optional()
    .isIn(["name", "-name", "createdAt", "-createdAt"])
    .withMessage("Invalid sort option"),
];
