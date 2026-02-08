import express from "express";
import type { Request, Response } from "express";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { logger } from "./middleware/logger.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to my first Express Server!");
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/about", (req: Request, res: Response) => {
  res.json({
    message: "This is an about page",
    port: `Port Number is: ${PORT}`,
  });
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
