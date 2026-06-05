import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/shared/PageLayout";
import { LoadingState } from "@/components/shared/LoadingState";
import { containerVariants, itemVariants } from "@/lib/animations";
import { formatPrice, formatDate } from "@/lib/utils";
import api from "@/lib/api";

interface Order {
  _id: string;
  orderNumber: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  shipped: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    try {
      const { data } = await api.get("/orders");
      setOrders(data.data.orders);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <LoadingState text="Loading orders..." />
      </PageLayout>
    );
  }

  if (orders.length === 0) {
    return (
      <PageLayout>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-20 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-9 h-9 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            No orders yet
          </h1>
          <p className="text-muted-foreground mb-8">
            When you place an order, it will appear here.
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
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-display font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground mt-1">{orders.length} order(s)</p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          {orders.map((order) => {
            const itemNames = order.items.map((i) => i.name).join(", ");
            const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

            return (
              <Link key={order._id} to={`/orders/${order._id}`}>
                <motion.div
                  whileHover={{ scale: 1.005 }}
                  className="flex items-center gap-4 p-5 rounded-xl bg-card border hover:border-primary/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-foreground">
                        {order.orderNumber}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] capitalize ${statusColors[order.status] || ""}`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{itemNames}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {totalItems} item(s) · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-semibold text-foreground">
                      {formatPrice(order.total)}
                    </p>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto mt-1" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </motion.div>
    </PageLayout>
  );
}
