import { Query } from "mongoose";

class ApiFeatures<T> {
  query: Query<T[], T>;
  queryString: Record<string, string>;
  total: number;

  constructor(query: Query<T[], T>, queryString: Record<string, string>) {
    this.query = query;
    this.queryString = queryString;
    this.total = 0;
  }

  filter(): this {
    const queryObj = { ...this.queryString };

    const excludedFields = ["page", "limit", "sort", "fields", "search"];
    excludedFields.forEach((field) => {
      delete queryObj[field];
    });

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );

    const parsed = JSON.parse(queryStr);
    const convertValues = (obj: Record<string, any>): Record<string, any> => {
      for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          convertValues(obj[key]);
        } else if (typeof obj[key] === "string" && !isNaN(Number(obj[key]))) {
          obj[key] = Number(obj[key]);
        }
      }
      return obj;
    };
    this.query = this.query.find(convertValues(parsed));
    return this;
  }

  search(fields: string[]): this {
    if (this.queryString.search) {
      const searchRegex = {
        $or: fields.map((field) => ({
          [field]: { $regex: this.queryString.search, $options: "i" },
        })),
      };
      this.query = this.query.find(searchRegex);
    }
    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  selectFields(): this {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate(): this {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  async countTotal(): Promise<this> {
    const countQuery = this.query.model.find(this.query.getFilter());
    this.total = await countQuery.countDocuments();
    return this;
  }
}

export default ApiFeatures;
