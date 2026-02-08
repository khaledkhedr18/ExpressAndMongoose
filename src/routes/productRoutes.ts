import { Router, Request, Response } from "express";
import { validateProduct } from "../middleware/validateProduct.js";
import {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = Router();

router.route("/").get(getProducts).post(validateProduct, createProduct);

router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

export default router;
