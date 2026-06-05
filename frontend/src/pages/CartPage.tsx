import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/shared/PageLayout";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { getProductImage } from "@/lib/product-images";
import { containerVariants, itemVariants } from "@/lib/animations";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const summary = useMemo(() => useCartStore.getState().getSummary(), [items]);

  if (items.length === 0) {
    return (
      <PageLayout>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-20 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-9 h-9 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any products yet.
          </p>
          <Link to="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </motion.div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Shopping Cart ({summary.itemCount})
            </h1>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={clearCart}>
            Clear Cart
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.product._id + item.color}
                layout
                className="flex gap-4 p-4 rounded-xl bg-card border"
              >
                <img
                  src={getProductImage(item.product.slug)}
                  alt={item.product.name}
                  className="w-24 h-24 rounded-lg object-cover bg-muted"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="text-base font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground capitalize mt-0.5">
                    Color: {item.color}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {item.product.shortDescription}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-semibold text-foreground">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.product._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Order Summary */}
          <motion.div variants={itemVariants}>
            <div className="rounded-xl bg-card border p-6 sticky top-28 space-y-4">
              <h2 className="text-lg font-display font-semibold text-foreground">
                Order Summary
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({summary.itemCount} items)</span>
                  <span>{formatPrice(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className={summary.shipping === 0 ? "text-emerald-500 font-medium" : ""}>
                    {summary.shipping === 0 ? "FREE" : formatPrice(summary.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (18%)</span>
                  <span>{formatPrice(summary.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-foreground font-semibold text-base">
                  <span>Total</span>
                  <span>{formatPrice(summary.total)}</span>
                </div>
              </div>

              {summary.subtotal < 2999 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatPrice(2999 - summary.subtotal)} more for free shipping!
                </p>
              )}

              <Link to="/checkout">
                <Button className="w-full gap-2 mt-2" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PageLayout>
  );
}
