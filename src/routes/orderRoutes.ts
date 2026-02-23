import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrder,
  getOrderByNumber,
  cancelOrder,
} from "../controllers/orderController.js";
import {
  createOrderRules,
  getOrderRules,
  getOrderByNumberRules,
  cancelOrderRules,
  getOrdersQueryRules,
} from "../middleware/validators/orderValidator.js";
import validate from "../middleware/validators/validate.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// All order routes require authentication
router.use(protect);

router
  .route("/")
  .get(getOrdersQueryRules, validate, getMyOrders)
  .post(createOrderRules, validate, createOrder);

router.get(
  "/number/:orderNumber",
  getOrderByNumberRules,
  validate,
  getOrderByNumber,
);

router.get("/:id", getOrderRules, validate, getOrder);

router.patch("/:id/cancel", cancelOrderRules, validate, cancelOrder);

export default router;
