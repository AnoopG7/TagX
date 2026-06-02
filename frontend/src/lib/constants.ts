// ---- App Constants ----

export const APP_NAME = "TagX" as const;
export const APP_TAGLINE = "Never Lose What Matters" as const;
export const APP_DESCRIPTION =
  "Smart Bluetooth tracking tags for bags, phones, kids, pets, and more. AI-powered habit prediction. Find what matters.™" as const;

// ---- API ----
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// ---- Product Categories ----
export const PRODUCT_CATEGORIES = [
  { value: "personal", label: "Personal", icon: "🔑" },
  { value: "pet", label: "Pets", icon: "🐕" },
  { value: "vehicle", label: "Vehicle", icon: "🚗" },
  { value: "luggage", label: "Luggage", icon: "🧳" },
  { value: "kids", label: "Kids", icon: "👶" },
  { value: "enterprise", label: "Enterprise", icon: "🏢" },
] as const;

// ---- Order Statuses ----
export const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "tagx-warm" },
  { value: "confirmed", label: "Confirmed", color: "tagx-accent" },
  { value: "shipped", label: "Shipped", color: "tagx-accent" },
  { value: "delivered", label: "Delivered", color: "tagx-success" },
  { value: "cancelled", label: "Cancelled", color: "tagx-danger" },
] as const;

// ---- Stats (for homepage hero) ----
export const HERO_STATS = [
  { label: "Users", value: "50K+", suffix: "" },
  { label: "Recovery Rate", value: "99.9", suffix: "%" },
  { label: "Battery Life", value: "1", suffix: " Year" },
  { label: "Range", value: "300", suffix: "ft" },
] as const;

// ---- Navigation Links ----
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

// ---- Social Links ----
export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/tagx",
  instagram: "https://instagram.com/tagx",
  linkedin: "https://linkedin.com/company/tagx",
  github: "https://github.com/tagx",
} as const;

// ---- Pagination ----
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 48;
