import { Router, Request, Response } from "express";
import { validateProduct } from "../middleware/validateProduct.js";
import {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  createProductRules,
  getProductRules,
  getProductsQueryRules,
  updateProductRules,
} from "../middleware/validators/productValidator.js";
import validate from "../middleware/validators/validate.js";

const router = Router();

router
  .route("/")
  .get(getProductsQueryRules, validate, getProducts)
  .post(createProductRules, validate, createProduct);

router
  .route("/:id")
  .get(getProductRules, validate, getProduct)
  .patch(getProductRules, updateProductRules, validate, updateProduct)
  .delete(getProductRules, validate, deleteProduct);

export default router;
