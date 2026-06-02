import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product.types";

export function ProductCard({
  product,
  onAddToCart,
  index = 0,
}: {
  product: Product;
  onAddToCart?: (product: Product) => void;
  index?: number;
}) {
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/30 transition-all duration-200 h-full">
        <Link to={`/products/${product.slug}`} className="block relative overflow-hidden aspect-square">
          <img
            src={product.images[0]?.url || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
            >
              <Eye className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          </div>

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isFeatured && (
              <Badge className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border-0">
                Featured
              </Badge>
            )}
            {discountPercent && (
              <Badge className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 border-0">
                -{discountPercent}%
              </Badge>
            )}
          </div>
        </Link>

        <CardContent className="p-4 space-y-2">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
            {product.category}
          </p>

          <Link to={`/products/${product.slug}`}>
            <h3 className="font-display font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
              {product.name}
            </h3>
          </Link>

          {product.averageRating > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className="text-amber-400 font-medium">{product.averageRating.toFixed(1)}</span>
              <span>({product.reviewCount} reviews)</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.(product);
              }}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
