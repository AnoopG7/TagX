// ---- Product Types ----

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductSpecs {
  battery: string;
  range: string;
  waterproof: string;
  weight: string;
  dimensions: string;
  connectivity: string;
}

export type ProductCategory =
  | "personal"
  | "pet"
  | "vehicle"
  | "luggage"
  | "kids";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: ProductCategory;
  colors: ProductColor[];
  features: string[];
  specs: ProductSpecs;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  product: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

// ---- Product Query Params ----

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: ProductCategory;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}
