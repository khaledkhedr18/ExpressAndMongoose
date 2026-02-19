import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      maxLength: [200, "Description cannot exceed 200 characters"],
    },
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

categorySchema.pre("findOneAndDelete", async function () {
  const categoryId = this.getQuery()["_id"];

  await mongoose.model("Product").deleteMany({ category: categoryId });
});

categorySchema.pre("findOneAndDelete", function (doc) {
  if (doc) {
    console.log(`Category "${doc.name}" deleted. Related products removed`);
  }
});

export default Category;
