import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import config from "../config/env.js";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(`Access denied. No token provided.`, 401));
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };

    req.user = decoded;

    next();
  } catch (error) {
    return next(new AppError(`Invalid or expired token`, 401));
  }
};

export const authorize = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const User = (await import("../models/User.js")).default;

    const user = await User.findById(req.user?.userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (!roles.includes(user.role)) {
      return next(
        new AppError(
          `Role '${user.role}' is not authorized to access this route`,
          403,
        ),
      );
    }

    next();
  };
};
