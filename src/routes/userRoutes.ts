import { Router, Request, Response } from "express";
import User from "../models/User.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  createUser,
} from "../controllers/userController.js";
import {
  createUserRules,
  getUserRules,
  updateUserRules,
} from "../middleware/validators/userValidator.js";
import validate from "../middleware/validators/validate.js";

const router = Router();

router.route("/").get(getUsers).post(createUserRules, validate, createUser);

router
  .route("/:id")
  .get(getUserRules, validate, getUser)
  .delete(getUserRules, validate, deleteUser)
  .patch(getUserRules, updateUserRules, validate, updateUser);

export default router;
