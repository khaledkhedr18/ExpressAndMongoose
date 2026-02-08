import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  description?: string;
  category: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
      type: String,
      required: [true, "Product category is required!"],
      enum: {
        values: ["electronics", "furniture", "clothing", "books", "other"],
        message: "{VALUE} is not a valid category",
      },
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
