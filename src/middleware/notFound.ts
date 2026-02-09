import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
};

export default notFound;
