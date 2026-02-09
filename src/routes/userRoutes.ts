// src/routes/userRoutes.ts

import { Router, Request, Response } from "express";
import User from "../models/user.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  createUser,
} from "../controllers/userController.js";

const router = Router();

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);

export default router;
