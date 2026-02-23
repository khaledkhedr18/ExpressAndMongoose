import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import {
  addToCartRules,
  updateCartItemRules,
  removeFromCartRules,
} from "../middleware/validators/cartValidator.js";
import validate from "../middleware/validators/validate.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// All cart routes require authentication
router.use(protect);

router
  .route("/")
  .get(getCart)
  .post(addToCartRules, validate, addToCart)
  .patch(updateCartItemRules, validate, updateCartItem)
  .delete(clearCart);

router.delete("/item", removeFromCartRules, validate, removeFromCart);

export default router;
