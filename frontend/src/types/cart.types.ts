// ---- Cart Types ----

import type { Product } from "./product.types";

export interface CartItem {
  product: Product;
  quantity: number;
  color: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  updatedAt: string;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  color: string;
}

export interface UpdateCartPayload {
  productId: string;
  quantity: number;
}

// ---- Cart Summary (computed on client) ----

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}
