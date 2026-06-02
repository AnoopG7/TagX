import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Users, Bell, Sparkles, Shield, Settings, LogOut } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useUIStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const authLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/family", label: "Family", icon: Users },
  { href: "/insights", label: "Insights", icon: Sparkles },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/alerts", label: "Alerts", icon: Shield },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const { isMobileNavOpen, closeMobileNav } = useUIStore();
  const { isAuthenticated, logout } = useAuthStore();
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
            {NAV_LINKS.filter((l) => l.href === "/").map((link, i) => (
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
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08, duration: 0.3 }}
              >
                <Link
                  to="/dashboard"
                  onClick={closeMobileNav}
                  className={cn(
                    "block py-3 text-xl font-display font-semibold transition-colors",
                    location.pathname === "/dashboard"
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  Dashboard
                </Link>
              </motion.div>
            )}
            {NAV_LINKS.filter((l) => l.href !== "/").map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (i + (isAuthenticated ? 1 : 0) + 1) * 0.08, duration: 0.3 }}
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

            {isAuthenticated && (
              <>
                <Separator className="my-4" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium px-1">
                  Dashboard
                </p>
                {authLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={link.href}
                      onClick={closeMobileNav}
                      className="flex items-center gap-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <link.icon className="size-4" />
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <Separator className="my-4" />
                <button
                  onClick={() => { logout(); closeMobileNav(); }}
                  className="flex items-center gap-3 py-2.5 text-sm text-destructive transition-colors"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </>
            )}

            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
                className="flex flex-col gap-3 mt-4"
              >
                <Link to="/login" onClick={closeMobileNav}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={closeMobileNav}>
                  <Button className="w-full">
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
