import { Request, Response, NextFunction } from "express";

export const validateProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method == "POST") {
    const errors: string[] = [];
    const { name, price } = req.body || {};
    if (!name || typeof name !== "string") {
      errors.push("Name field is required and must be a string!");
    }

    if (!price || typeof price !== "number") {
      errors.push("Price field is required and must be a positive number");
    }

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }
  }

  next();
};
