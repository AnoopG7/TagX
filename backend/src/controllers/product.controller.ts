import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as productService from "../services/product.service.js";
import type { ProductCategory } from "../models/product.model.js";

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, category, tag, minPrice, maxPrice, search, sort } = req.query;

  const result = await productService.listProducts({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    category: category ? String(category) as ProductCategory : undefined,
    tag: tag ? String(tag) : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    search: search ? String(search) : undefined,
    sort: sort ? String(sort) : undefined,
  });

  res.json(ApiResponse.ok(result));
});

export const getFeaturedProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await productService.getFeaturedProducts();
  res.json(ApiResponse.ok({ products }));
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const product = await productService.getProductBySlug(slug);
  res.json(ApiResponse.ok({ product }));
});
