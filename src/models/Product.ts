import mongoose, { Schema, Document, Query } from "mongoose";

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
  quantity: number;
  inStock: boolean;
  slug: string;
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
    slug: {
      type: String,
      unique: true,
    },
    quantity: {
      type: Number,
      required: true,
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
      ref: "Category",
      required: [true, "Product category is required!"],
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

productSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

productSchema.pre("save", function () {
  if (this.quantity === 0) {
    this.inStock = false;
  }
});

productSchema.pre(/^find/, function (this: Query<any, IProduct>) {
  this.populate("category", "name").populate(
    "createdBy",
    "firstName lastName email",
  );
});

productSchema.pre(/^find/, function (this: Query<IProduct[], IProduct>) {
  this.where({ inStock: true });
});



productSchema.post("save", function (doc) {
  console.log(`Product ${doc.name} was saved with id: ${doc._id}`);
});

productSchema.post("save", async function (doc) {
  if (doc.reviews.length > 0) {
    const totalRating = doc.reviews.reduce((sum: number, review: IReview) => {
      return sum + review.rating;
    }, 0);
    doc.averageRating = totalRating / doc.reviews.length;
  }

  await Product.updateOne(
    { _id: doc._id },
    { averageRating: doc.averageRating },
  );
});


const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
