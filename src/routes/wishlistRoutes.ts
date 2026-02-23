import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";
import {
  addToWishlistRules,
  removeFromWishlistRules,
} from "../middleware/validators/wishlistValidator.js";
import validate from "../middleware/validators/validate.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// All wishlist routes require authentication
router.use(protect);

router
  .route("/")
  .get(getWishlist)
  .post(addToWishlistRules, validate, addToWishlist)
  .delete(clearWishlist);

router.delete(
  "/:productId",
  removeFromWishlistRules,
  validate,
  removeFromWishlist,
);

export default router;
