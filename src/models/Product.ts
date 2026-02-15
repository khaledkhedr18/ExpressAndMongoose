import mongoose, { Schema, Document } from "mongoose";

export interface IReview {
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  name: string;
  price: number;
  description?: string;
  category: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  inStock: boolean;
  reviews: IReview[];
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    rating: {
      type: Number,
      required: [true, "Review must have a rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  },
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product Name is required!"],
      trim: true,
      maxlength: [100, "Product Name cannot exceed 100 characters!"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required!"],
      min: [0, "Product price should be a positive number!"],
    },
    description: {
      type: String,
      maxlength: [500, "Description Length cannot exceed 500 characters!"],
    },
    category: {
      type: Schema.Types.ObjectId,
      required: [true, "Product category is required!"],
      enum: {
        values: ["electronics", "furniture", "clothing", "books", "other"],
        message: "{VALUE} is not a valid category",
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product must have a creator"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
