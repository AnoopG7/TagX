import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Package, Truck, CheckCircle2, Clock, XCircle, MapPin, CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/shared/PageLayout";
import { LoadingState } from "@/components/shared/LoadingState";
import { containerVariants, itemVariants } from "@/lib/animations";
import { formatPrice, formatDate } from "@/lib/utils";
import api from "@/lib/api";

interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  image: string;
}

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { color: string; icon: typeof Clock; label: string }> = {
  pending: { color: "text-amber-500", icon: Clock, label: "Pending" },
  confirmed: { color: "text-blue-500", icon: CheckCircle2, label: "Confirmed" },
  shipped: { color: "text-violet-500", icon: Truck, label: "Shipped" },
  delivered: { color: "text-emerald-500", icon: CheckCircle2, label: "Delivered" },
  cancelled: { color: "text-red-500", icon: XCircle, label: "Cancelled" },
};

const STATUS_STEPS = ["confirmed", "shipped", "delivered"];

const paymentLabels: Record<string, string> = {
  cod: "Cash on Delivery",
  upi: "UPI",
  card: "Credit / Debit Card",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchOrder() {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.data.order);
    } catch {
      toast.error("Order not found");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <LoadingState text="Loading order..." />
      </PageLayout>
    );
  }

  if (!order) return null;

  const cfg = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = cfg.icon;
  const currentStepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <PageLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/orders")}
            className="gap-1.5 mb-2 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            My Orders
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Order {order.orderNumber}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`text-sm px-3 py-1 capitalize ${cfg.color}`}
            >
              <StatusIcon className="w-4 h-4 mr-1.5" />
              {cfg.label}
            </Badge>
          </div>
        </motion.div>

        {/* Status Timeline */}
        {order.status !== "cancelled" && (
          <motion.div variants={itemVariants} className="rounded-xl bg-card border p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Order Progress</h2>
            <div className="flex items-center justify-between relative">
              {/* Background line */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-border" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all"
                style={{
                  width: currentStepIdx >= 0 ? `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` : "0%",
                }}
              />

              {STATUS_STEPS.map((step, i) => {
                const isCompleted = i <= currentStepIdx;
                const isCurrent = i === currentStepIdx;
                const stepCfg = statusConfig[step];
                const Icon = stepCfg.icon;
                return (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-card border-border text-muted-foreground"
                      } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                      {stepCfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="rounded-xl bg-card border p-6 space-y-4">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Items ({order.items.length})
              </h2>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-lg bg-surface/50">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-md object-cover bg-muted"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">Color: {item.color}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (18%)</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-foreground font-semibold text-base pt-1">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className="space-y-4">
            {/* Shipping Address */}
            <div className="rounded-xl bg-card border p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Shipping Address
              </h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p className="text-foreground font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                </p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.email}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-xl bg-card border p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Payment
              </h3>
              <p className="text-sm text-muted-foreground">
                {paymentLabels[order.paymentMethod] || order.paymentMethod}
              </p>
            </div>

            {/* Actions */}
            <Link to="/products">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </PageLayout>
  );
}
