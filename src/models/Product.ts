import mongoose, { Schema, Document, Query } from "mongoose";

export interface IVariantImage {
  url: string;
  view: string;
}

export interface IVariantSize {
  size: string;
  sku: string;
  stock: number;
  price: number;
}

export interface IVariantColor {
  name: string;
  hex: string;
}

export interface IVariant {
  variantId: string;
  color: IVariantColor;
  images: IVariantImage[];
  sizes: IVariantSize[];
}

export interface ISizeGuideEntry {
  size: string;
  chest: number;
  length: number;
}

export interface ISizeGuide {
  unit: string;
  chart: ISizeGuideEntry[];
}

export interface IRatings {
  average: number;
  count: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  category: string;
  brand: string;
  tags: string[];
  gender: string;
  variants: IVariant[];
  basePrice: number;
  currency: string;
  discountPercent: number;
  sizeGuide?: ISizeGuide;
  material?: string;
  careInstructions: string[];
  ratings: IRatings;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const variantImageSchema = new Schema<IVariantImage>(
  {
    url: { type: String, required: [true, "Image URL is required"] },
    view: { type: String, required: [true, "Image view is required"] },
  },
  { _id: false },
);

const variantSizeSchema = new Schema<IVariantSize>(
  {
    size: { type: String, required: [true, "Size is required"] },
    sku: { type: String, required: [true, "SKU is required"] },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  { _id: false },
);

const variantColorSchema = new Schema<IVariantColor>(
  {
    name: { type: String, required: [true, "Color name is required"] },
    hex: { type: String, required: [true, "Color hex is required"] },
  },
  { _id: false },
);

const variantSchema = new Schema<IVariant>(
  {
    variantId: { type: String, required: [true, "Variant ID is required"] },
    color: {
      type: variantColorSchema,
      required: [true, "Variant color is required"],
    },
    images: {
      type: [variantImageSchema],
      validate: {
        validator: (arr: IVariantImage[]) => arr.length <= 10,
        message: "Cannot have more than 10 images per variant",
      },
    },
    sizes: {
      type: [variantSizeSchema],
      required: [true, "At least one size is required"],
      validate: {
        validator: (arr: IVariantSize[]) => arr.length > 0,
        message: "At least one size entry is required",
      },
    },
  },
  { _id: false },
);

const sizeGuideEntrySchema = new Schema<ISizeGuideEntry>(
  {
    size: { type: String, required: true },
    chest: { type: Number, required: true },
    length: { type: Number, required: true },
  },
  { _id: false },
);

const sizeGuideSchema = new Schema<ISizeGuide>(
  {
    unit: { type: String, default: "cm" },
    chart: { type: [sizeGuideEntrySchema], default: [] },
  },
  { _id: false },
);

const ratingsSchema = new Schema<IRatings>(
  {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "unisex",
    },
    variants: {
      type: [variantSchema],
      required: [true, "At least one variant is required"],
      validate: {
        validator: (arr: IVariant[]) => arr.length > 0,
        message: "At least one variant is required",
      },
    },
    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Base price cannot be negative"],
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    sizeGuide: {
      type: sizeGuideSchema,
      default: undefined,
    },
    material: {
      type: String,
      trim: true,
    },
    careInstructions: {
      type: [String],
      default: [],
    },
    ratings: {
      type: ratingsSchema,
      default: () => ({ average: 0, count: 0 }),
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

productSchema.post("save", function (doc) {
  console.log(`Product "${doc.name}" saved with id: ${doc._id}`);
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
