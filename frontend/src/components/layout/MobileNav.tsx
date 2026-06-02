import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { useUIStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function MobileNav() {
  const { isMobileNavOpen, closeMobileNav } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  return (
    <AnimatePresence>
      {isMobileNavOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 top-16 bottom-0 z-40 bg-background/95 backdrop-blur-xl md:hidden overflow-y-auto"
        >
          <div className="px-6 py-8 flex flex-col gap-2">
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
              >
                <Link
                  to={link.href}
                  onClick={closeMobileNav}
                  className={cn(
                    "block py-3 text-xl font-display font-semibold transition-colors",
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <Separator className="my-4 bg-border" />

            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
                className="flex flex-col gap-3"
              >
                <Link to="/login" onClick={closeMobileNav}>
                  <Button
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-surface"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={closeMobileNav}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
