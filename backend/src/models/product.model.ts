import mongoose, { Schema, type Document } from "mongoose";

export type ProductCategory =
  | "personal"
  | "pet"
  | "vehicle"
  | "luggage"
  | "kids"
  | "enterprise";

export interface IProductImage {
  url: string;
  publicId: string;
  alt: string;
  isPrimary: boolean;
}

export interface IProductSpecs {
  battery: string;
  range: string;
  waterproof: string;
  weight: string;
  dimensions: string;
  connectivity: string;
  [key: string]: string;
}

export interface IProductSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku?: string;
  images: IProductImage[];
  category: ProductCategory;
  tags: string[];
  features: string[];
  specs: IProductSpecs;
  isFeatured: boolean;
  isActive: boolean;
  seo: IProductSEO;
  totalRatings: number;
  averageRating: number;
  reviewCount: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    costPrice: {
      type: Number,
      min: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
        alt: { type: String, default: "" },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
          values: ["personal", "pet", "vehicle", "luggage", "kids", "enterprise"],
        message: "{VALUE} is not a valid category",
      },
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    features: [{ type: String, trim: true }],
    specs: {
      battery: { type: String, default: "" },
      range: { type: String, default: "" },
      waterproof: { type: String, default: "" },
      weight: { type: String, default: "" },
      dimensions: { type: String, default: "" },
      connectivity: { type: String, default: "" },
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    seo: {
      metaTitle: { type: String, maxlength: 60 },
      metaDescription: { type: String, maxlength: 160 },
      keywords: [{ type: String }],
    },
    totalRatings: { type: Number, default: 0, min: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

productSchema.index({ slug: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ name: "text", description: "text", "seo.keywords": "text" });

export const Product = mongoose.model<IProduct>("Product", productSchema);
