import { Request, Response, NextFunction } from "express";
import config from "../config/env.js";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  if (config.isDevelopment) {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms.`,
      );
    });
  }
  next();
};
