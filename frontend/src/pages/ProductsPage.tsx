import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PackageOpen } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/common/ProductCard";
import { PageLayout } from "@/components/shared/PageLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { containerVariants, itemVariants } from "@/lib/animations";
import api from "@/lib/api";
import type { Product } from "@/types/product.types";

const categories = [
  { label: "All", value: "all" },
  { label: "Personal", value: "personal" },
  { label: "Pet", value: "pet" },
  { label: "Vehicle", value: "vehicle" },
  { label: "Luggage", value: "luggage" },
  { label: "Kids", value: "kids" },
  { label: "Enterprise", value: "enterprise" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (activeCategory !== "all") {
        params.category = activeCategory;
      }
      const res = await api.get("/products", { params });
      setProducts(res.data.data.products || []);
    } catch {
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="text-center">
          <PageHeader
            title="Find What Matters"
            description="Smart tracking tags for everything you care about — from keys to luggage, pets to vehicles."
          />
        </motion.div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-8">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square w-full rounded-xl" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <PackageOpen className="w-16 h-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or check back later.
                </p>
              </div>
            ) : (
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    index={index}
                  />
                ))}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </PageLayout>
  );
}
