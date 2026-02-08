import express from "express";
import type { Request, Response } from "express";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { logger } from "./middleware/logger.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import config from "./config/env.js";

connectDB();

const app = express();

app.use(express.json());
app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to my first Express Server!",
    environment: config.nodeEnv,
  });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

app.get("/api/about", (req: Request, res: Response) => {
  res.json({
    message: "This is an about page",
    port: `Port Number is: ${config.port}`,
  });
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.listen(config.port, () => {
  console.log(
    `Server is running in ${config.nodeEnv} mode on port ${config.port}`,
  );
});
