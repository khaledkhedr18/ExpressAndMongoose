import mongoose from "mongoose";
import config from "./env.js";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri as string);
    console.log(`Connected to database on host: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
