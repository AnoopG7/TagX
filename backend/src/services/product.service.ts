import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import type { ProductCategory } from "../models/product.model.js";

interface ProductListOptions {
  page?: number;
  limit?: number;
  category?: ProductCategory;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
}

export async function listProducts(options: ProductListOptions) {
  const {
    page = 1,
    limit = 12,
    category,
    tag,
    minPrice,
    maxPrice,
    search,
    sort = "-createdAt",
  } = options;

  const filter: Record<string, unknown> = { isActive: true };

  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) (filter.price as Record<string, number>).$gte = minPrice;
    if (maxPrice !== undefined) (filter.price as Record<string, number>).$lte = maxPrice;
  }
  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getProductBySlug(slug: string) {
  const product = await Product.findOne({ slug, isActive: true });
  if (!product) {
    throw ApiError.notFound("Product not found");
  }
  return product;
}

export async function getFeaturedProducts() {
  return Product.find({ isFeatured: true, isActive: true }).sort("price");
}

export async function getProductById(id: string) {
  const product = await Product.findById(id);
  if (!product) {
    throw ApiError.notFound("Product not found");
  }
  return product;
}
