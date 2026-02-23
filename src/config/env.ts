import dotenv from "dotenv";

dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpire: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  allowedApps: string[];
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  emailFrom: string;
  otpExpiresMinutes: number;
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "default-secret-change-me",
  jwtExpire: process.env.JWT_EXPIRE || "30d",
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  allowedApps: JSON.parse(process.env.ALLOWED_APPS || "[]"),
  smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
  smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
  smtpUser: process.env.SMTP_USER || "",
  smtpPassword: process.env.SMTP_PASSWORD || "",
  emailFrom: process.env.EMAIL_FROM || process.env.SMTP_USER || "",
  otpExpiresMinutes: parseInt(process.env.OTP_EXPIRES_MINUTES || "10", 10),
};

const requiredVars = ["MONGO_URI", "JWT_SECRET"];

for (const envVar of requiredVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable ${envVar}`);
  }
}

export default config;
