import { Router, Request, Response } from "express";
import {
  createCategoryRules,
  getCategoriesQueryRules,
  getCategoryRules,
  updateCategoryRules,
} from "../middleware/validators/categoryValidator.js";
import validate from "../middleware/validators/validate.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/categoryController.js";

const router = Router();

router
  .route("/")
  .get(getCategoriesQueryRules, validate, getCategories)
  .post(createCategoryRules, validate, createCategory);

router
  .route("/:id")
  .get(getCategoryRules, validate, getCategory)
  .patch(getCategoryRules, updateCategoryRules, validate, updateCategory)
  .delete(getCategoryRules, validate, deleteCategory);

export default router;
