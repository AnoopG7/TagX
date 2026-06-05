import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard, Banknote, Smartphone, ShoppingCart, Loader2, ArrowLeft, Shield, Truck, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getProductImage } from "@/lib/product-images";
import { PageLayout } from "@/components/shared/PageLayout";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { containerVariants, itemVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

type PaymentMethod = "cod" | "upi" | "card";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; icon: typeof CreditCard; desc: string }[] = [
  { value: "cod", label: "Cash on Delivery", icon: Banknote, desc: "Pay when you receive" },
  { value: "upi", label: "UPI", icon: Smartphone, desc: "GPay, PhonePe, Paytm" },
  { value: "card", label: "Card", icon: CreditCard, desc: "Credit or Debit Card" },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const summary = useMemo(() => useCartStore.getState().getSummary(), [items]);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Basic validation
    for (const [key, val] of Object.entries(form)) {
      if (!val.trim()) {
        toast.error(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        color: item.color,
      }));

      const { data } = await api.post("/orders", {
        items: orderItems,
        shippingAddress: form,
        paymentMethod,
      });

      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/orders/${data.data.order._id}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

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
            Nothing to checkout
          </h1>
          <p className="text-muted-foreground mb-8">
            Your cart is empty. Add some products first.
          </p>
          <Button onClick={() => navigate("/products")} size="lg">
            Browse Products
          </Button>
        </motion.div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div variants={itemVariants}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/cart")}
            className="gap-1.5 mb-2 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-display font-bold text-foreground">Checkout</h1>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <motion.div variants={itemVariants} className="rounded-xl bg-card border p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    Shipping Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123, Main Street, Apt 4B"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="Maharashtra"
                      value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      placeholder="400001"
                      value={form.pincode}
                      onChange={(e) => updateField("pincode", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div variants={itemVariants} className="rounded-xl bg-card border p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PAYMENT_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const selected = paymentMethod === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPaymentMethod(opt.value)}
                        className={cn(
                          "p-4 rounded-lg border text-left transition-all",
                          selected
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/30"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5 mb-2",
                            selected ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                        <p className="text-sm font-medium text-foreground">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                        {selected && (
                          <CheckCircle2 className="w-4 h-4 text-primary mt-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right — Summary */}
            <motion.div variants={itemVariants}>
              <div className="rounded-xl bg-card border p-6 sticky top-28 space-y-4">
                <h2 className="text-lg font-display font-semibold text-foreground">
                  Order Summary
                </h2>

                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product._id + item.color} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-muted overflow-hidden shrink-0">
                        <img
                          src={getProductImage(item.product.slug)}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
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
                  <div className="flex justify-between text-foreground font-semibold text-base pt-1">
                    <span>Total</span>
                    <span>{formatPrice(summary.total)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </>
                  )}
                </Button>

                <p className="text-[11px] text-muted-foreground text-center">
                  By placing your order, you agree to our Terms of Service.
                </p>
              </div>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </PageLayout>
  );
}

