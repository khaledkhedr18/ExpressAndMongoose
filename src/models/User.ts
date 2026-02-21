import mongoose, { Schema, Document, Query } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/env.js";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  role: "user" | "admin" | "moderator";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative-"],
      max: [100, "Age cannot exceed 100"],
      default: 24,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "moderator"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function (): string {
  const secret = config.jwtSecret!;
  const expire = config.jwtExpire as jwt.SignOptions["expiresIn"];

  return jwt.sign({ userId: this.id }, secret, {
    expiresIn: expire,
  });
};

userSchema.pre(/^find/, function (this: Query<IUser[], IUser>) {
  this.where({ isActive: true });
});

userSchema.pre("findOneAndDelete", async function () {
  const userId = this.getQuery()["_id"];

  await mongoose.model("Product").deleteMany({ createdBy: userId });

  await mongoose
    .model("Product")
    .updateMany({}, { $pull: { reviews: { user: userId } } });
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
