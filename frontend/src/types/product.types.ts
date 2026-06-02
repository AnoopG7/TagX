export interface ProductImage {
  url: string;
  publicId: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductSpecs {
  battery: string;
  range: string;
  waterproof: string;
  weight: string;
  dimensions: string;
  connectivity: string;
}

export interface ProductSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export type ProductCategory =
  | "personal"
  | "pet"
  | "vehicle"
  | "luggage"
  | "kids"
  | "enterprise";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  category: ProductCategory;
  tags: string[];
  features: string[];
  specs: ProductSpecs;
  isFeatured: boolean;
  isActive: boolean;
  seo: ProductSEO;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: ProductCategory;
  tag?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}
