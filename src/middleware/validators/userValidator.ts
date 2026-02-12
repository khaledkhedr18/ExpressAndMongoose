// src/middleware/validators/userValidator.ts

import { body, param } from "express-validator";

export const createUserRules = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("First name must be between 2 and 30 characters"),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must be a string")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("Last name must be between 2 and 30 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and a number"),

  body("age")
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage("Age must be between 13 and 120"),

  body("role")
    .optional()
    .isIn(["user", "admin", "moderator"])
    .withMessage("Invalid role"),
];

export const updateUserRules = [
  body("firstName")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("First name must be between 2 and 30 characters"),

  body("lastName")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("Last name must be between 2 and 30 characters"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("age")
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage("Age must be between 13 and 120"),
];

export const getUserRules = [
  param("id").isMongoId().withMessage("Invalid user ID format"),
];
