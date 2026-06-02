import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/shared/PageLayout";
import { containerVariants, itemVariants } from "@/lib/animations";
import api from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product.types";

const specLabels: Record<string, string> = {
  battery: "Battery",
  range: "Range",
  waterproof: "Waterproof",
  weight: "Weight",
  dimensions: "Dimensions",
  connectivity: "Connectivity",
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!slug) return;
    fetchProduct();
  }, [slug]);

  async function fetchProduct() {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await api.get(`/products/${slug}`);
      setProduct(res.data.data.product);
    } catch (err: unknown) {
      const axiosError = err as { response?: { status: number } };
      if (axiosError.response?.status === 404) {
        setNotFound(true);
        return;
      }
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <Skeleton className="h-8 w-24 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (notFound || !product) {
    return (
      <PageLayout>
        <div className="py-20 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Product Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/products")}>
            Browse Products
          </Button>
        </div>
      </PageLayout>
    );
  }

  const displayImage = product.images[selectedImage] || product.images[0];

  return (
    <PageLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Button
            variant="ghost"
            onClick={() => navigate("/products")}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <motion.div
              variants={itemVariants}
              className="aspect-square rounded-xl overflow-hidden bg-card border"
            >
              <img
                src={displayImage?.url || "/placeholder.jpg"}
                alt={displayImage?.alt || product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === selectedImage
                        ? "border-primary"
                        : "border-border hover:border-foreground/20"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <motion.div
            variants={itemVariants}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{product.category}</Badge>
              {product.isFeatured && (
                <Badge variant="warning">Featured</Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
            </div>

            {product.shortDescription && (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            <p className="text-foreground/80 leading-relaxed">
              {product.description}
            </p>

            {product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-foreground/80"
                    >
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-foreground mb-3">
                Specifications
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(specLabels).map(([key, label], i) => {
                      const value =
                        product.specs[
                          key as keyof typeof product.specs
                        ];
                      if (!value) return null;
                      return (
                        <tr
                          key={key}
                          className={
                            i % 2 === 0 ? "bg-card" : "bg-transparent"
                          }
                        >
                          <td className="px-4 py-3 text-muted-foreground font-medium w-1/3">
                            {label}
                          </td>
                          <td className="px-4 py-3 text-foreground">
                            {value}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={() =>
                toast.success("Coming soon — pre-order available")
              }
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Buy Now
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </PageLayout>
  );
}
