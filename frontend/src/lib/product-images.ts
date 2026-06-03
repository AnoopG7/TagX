export const PRODUCT_IMAGES: Record<string, string> = {
  "tagx-pro": "/TagX Pro.png",
  "tagx-mini": "/TagX Mini.png",
  "tagx-pet": "/TagX Pet.png",
  "tagx-vehicle": "/Tagx Bike.png",
  "tagx-luggage": "/TagX Luggage.png",
  "tagx-kids": "/TagX Kids.png",
  "tagx-wallet-card": "/TagX Mini.png",
  "tagx-enterprise-hub": "/TagX Pro.png",
  "tagx-pro-fleet-pack": "/TagX Pro.png",
  "tagx-vehicle-fleet-bundle": "/Tagx Bike.png",
  "tagx-asset-api-annual": "/TagX Pro.png",
  "tagx-retail-inventory-kit": "/TagX Mini.png",
};

export function getProductImage(slug: string): string {
  return PRODUCT_IMAGES[slug] || "/placeholder.jpg";
}
