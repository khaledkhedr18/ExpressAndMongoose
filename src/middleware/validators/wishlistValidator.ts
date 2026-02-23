import { body, param } from "express-validator";

export const addToWishlistRules = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),
];

export const removeFromWishlistRules = [
  param("productId")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ObjectId"),
];
