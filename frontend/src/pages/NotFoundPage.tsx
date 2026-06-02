import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/Logo";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        >
          <Frown className="w-16 h-16 mx-auto text-muted-foreground/40 mb-6" />
        </motion.div>

        <Logo size="lg" />

        <h1 className="mt-6 font-display text-7xl font-bold text-foreground tracking-tight">
          404
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Lost signal. This page doesn't exist.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <Home size={16} />
              Go Home
            </Button>
          </Link>
          <Link to="/products">
            <Button className="gap-2">
              <Search size={16} />
              Browse Products
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
