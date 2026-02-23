import { body, param, query } from "express-validator";

const variantColorRules = (prefix: string, optional = false) => {
  const base = optional ? body(prefix).optional() : body(prefix);
  return [
    base.isObject().withMessage("Color must be an object"),
    body(`${prefix}.name`)
      .notEmpty()
      .withMessage("Color name is required")
      .isString()
      .withMessage("Color name must be a string"),
    body(`${prefix}.hex`)
      .notEmpty()
      .withMessage("Color hex is required")
      .matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
      .withMessage("Color hex must be a valid hex color (e.g. #1a1a1a)"),
  ];
};

const variantImageRules = (prefix: string) => [
  body(prefix).optional().isArray().withMessage("Images must be an array"),
  body(`${prefix}.*.url`)
    .notEmpty()
    .withMessage("Image URL is required")
    .isURL()
    .withMessage("Image URL must be a valid URL"),
  body(`${prefix}.*.view`)
    .notEmpty()
    .withMessage("Image view is required")
    .isString()
    .withMessage("Image view must be a string"),
];

const variantSizeRules = (prefix: string) => [
  body(prefix)
    .isArray({ min: 1 })
    .withMessage("At least one size entry is required"),
  body(`${prefix}.*.size`)
    .notEmpty()
    .withMessage("Size is required")
    .isString()
    .withMessage("Size must be a string"),
  body(`${prefix}.*.sku`)
    .notEmpty()
    .withMessage("SKU is required")
    .isString()
    .withMessage("SKU must be a string"),
  body(`${prefix}.*.stock`)
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body(`${prefix}.*.price`)
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
];

export const createProductRules = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name must be a string")
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Product name must be between 2 and 150 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isString()
    .withMessage("Category must be a string")
    .trim(),

  body("brand")
    .notEmpty()
    .withMessage("Brand is required")
    .isString()
    .withMessage("Brand must be a string")
    .trim(),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings"),
  body("tags.*").optional().isString().withMessage("Each tag must be a string"),

  body("gender")
    .optional()
    .isIn(["male", "female", "unisex"])
    .withMessage("Gender must be male, female, or unisex"),

  body("variants")
    .isArray({ min: 1 })
    .withMessage("At least one variant is required"),
  body("variants.*.variantId")
    .notEmpty()
    .withMessage("Variant ID is required")
    .isString()
    .withMessage("Variant ID must be a string"),
  ...variantColorRules("variants.*.color"),
  ...variantImageRules("variants.*.images"),
  ...variantSizeRules("variants.*.sizes"),

  body("basePrice")
    .notEmpty()
    .withMessage("Base price is required")
    .isFloat({ min: 0 })
    .withMessage("Base price must be a non-negative number"),

  body("currency")
    .optional()
    .isString()
    .withMessage("Currency must be a string")
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency must be a 3-letter code (e.g. USD)"),

  body("discountPercent")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount percent must be between 0 and 100"),

  body("sizeGuide")
    .optional()
    .isObject()
    .withMessage("Size guide must be an object"),
  body("sizeGuide.unit")
    .optional()
    .isString()
    .withMessage("Unit must be a string"),
  body("sizeGuide.chart")
    .optional()
    .isArray()
    .withMessage("Chart must be an array"),
  body("sizeGuide.chart.*.size")
    .optional()
    .isString()
    .withMessage("Chart size must be a string"),
  body("sizeGuide.chart.*.chest")
    .optional()
    .isNumeric()
    .withMessage("Chart chest must be a number"),
  body("sizeGuide.chart.*.length")
    .optional()
    .isNumeric()
    .withMessage("Chart length must be a number"),

  body("material")
    .optional()
    .isString()
    .withMessage("Material must be a string"),

  body("careInstructions")
    .optional()
    .isArray()
    .withMessage("Care instructions must be an array of strings"),
  body("careInstructions.*")
    .optional()
    .isString()
    .withMessage("Each care instruction must be a string"),

  body("status")
    .optional()
    .isIn(["active", "inactive", "draft"])
    .withMessage("Status must be active, inactive, or draft"),
];

export const updateProductRules = [
  body("name")
    .optional()
    .isString()
    .withMessage("Product name must be a string")
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Product name must be between 2 and 150 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string")
    .trim(),

  body("brand")
    .optional()
    .isString()
    .withMessage("Brand must be a string")
    .trim(),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings"),
  body("tags.*").optional().isString().withMessage("Each tag must be a string"),

  body("gender")
    .optional()
    .isIn(["male", "female", "unisex"])
    .withMessage("Gender must be male, female, or unisex"),

  body("variants")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Variants must be a non-empty array"),
  body("variants.*.variantId")
    .optional()
    .isString()
    .withMessage("Variant ID must be a string"),
  body("variants.*.color")
    .optional()
    .isObject()
    .withMessage("Color must be an object"),
  body("variants.*.color.name")
    .optional()
    .isString()
    .withMessage("Color name must be a string"),
  body("variants.*.color.hex")
    .optional()
    .matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .withMessage("Color hex must be a valid hex color"),
  body("variants.*.images")
    .optional()
    .isArray()
    .withMessage("Images must be an array"),
  body("variants.*.images.*.url")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
  body("variants.*.images.*.view")
    .optional()
    .isString()
    .withMessage("Image view must be a string"),
  body("variants.*.sizes")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Sizes must be a non-empty array"),
  body("variants.*.sizes.*.size")
    .optional()
    .isString()
    .withMessage("Size must be a string"),
  body("variants.*.sizes.*.sku")
    .optional()
    .isString()
    .withMessage("SKU must be a string"),
  body("variants.*.sizes.*.stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("variants.*.sizes.*.price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("basePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Base price must be a non-negative number"),

  body("currency")
    .optional()
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency must be a 3-letter code"),

  body("discountPercent")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount percent must be between 0 and 100"),

  body("sizeGuide")
    .optional()
    .isObject()
    .withMessage("Size guide must be an object"),
  body("sizeGuide.unit")
    .optional()
    .isString()
    .withMessage("Unit must be a string"),
  body("sizeGuide.chart")
    .optional()
    .isArray()
    .withMessage("Chart must be an array"),
  body("sizeGuide.chart.*.size")
    .optional()
    .isString()
    .withMessage("Chart size must be a string"),
  body("sizeGuide.chart.*.chest")
    .optional()
    .isNumeric()
    .withMessage("Chart chest must be a number"),
  body("sizeGuide.chart.*.length")
    .optional()
    .isNumeric()
    .withMessage("Chart length must be a number"),

  body("material")
    .optional()
    .isString()
    .withMessage("Material must be a string"),

  body("careInstructions")
    .optional()
    .isArray()
    .withMessage("Care instructions must be an array"),
  body("careInstructions.*")
    .optional()
    .isString()
    .withMessage("Each care instruction must be a string"),

  body("status")
    .optional()
    .isIn(["active", "inactive", "draft"])
    .withMessage("Status must be active, inactive, or draft"),
];

export const getProductRules = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
];

export const getProductsQueryRules = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("minPrice must be a positive number"),

  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("maxPrice must be a positive number"),

  query("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),

  query("brand").optional().isString().withMessage("Brand must be a string"),

  query("gender")
    .optional()
    .isIn(["male", "female", "unisex"])
    .withMessage("Gender must be male, female, or unisex"),

  query("status")
    .optional()
    .isIn(["active", "inactive", "draft"])
    .withMessage("Status must be active, inactive, or draft"),

  query("sort")
    .optional()
    .isIn([
      "basePrice",
      "-basePrice",
      "name",
      "-name",
      "createdAt",
      "-createdAt",
      "ratings.average",
      "-ratings.average",
    ])
    .withMessage("Invalid sort option"),
];
