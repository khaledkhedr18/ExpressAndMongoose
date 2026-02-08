// src/routes/userRoutes.ts

import { Router, Request, Response } from "express";
import User from "../models/user.js";
import {
  deleteUser,
  getUser,
  getUsers,
  patchUser,
  postUser,
} from "../controllers/userController.js";

const router = Router();

router.route("/").get(getUsers).post(postUser);

router.route("/:id").get(getUser).delete(deleteUser).patch(patchUser);

export default router;
