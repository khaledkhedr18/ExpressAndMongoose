import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";
import config from "../config/env.js";

const handleCastErrorDB = (err: Error & { path?: string; value?: string }) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (
  err: Error & { keyValue?: Record<string, string> },
) => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : "unkown";
  const message = `Duplicate field value: ${value}. Please, use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (
  err: Error & { errors?: Record<string, { message: string }> },
) => {
  const errors = err.errors
    ? Object.values(err.errors).map((el) => el.message)
    : [];
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR ", err);
    res.status(500).json({
      success: false,
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const errorHandler = (
  err: Error & {
    statusCode?: number;
    status?: string;
    isOperational?: boolean;
    code?: number;
    path?: string;
    value?: string;
    keyValue?: Record<string, string>;
    errors?: Record<string, { message: string }>;
  },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const isOperational = err.isOperational || false;

  let error: AppError = Object.assign(new AppError(err.message, statusCode), {
    status,
    isOperational,
    stack: err.stack,
  });

  if (err.name === "CastError") error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === "ValidationError") error = handleValidationErrorDB(err);

  if (config.isDevelopment) {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

export default errorHandler;
