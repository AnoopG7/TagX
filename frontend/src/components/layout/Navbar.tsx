import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Settings, Users, Bell, Menu, X, LogOut,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Container } from "@/components/layout/Container";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_LINKS } from "@/lib/constants";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { isMobileNavOpen, toggleMobileNav, closeMobileNav } = useUIStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMobileNav();
  }, [location.pathname, closeMobileNav]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glassmorphism shadow-lg"
            : "bg-transparent"
        )}
      >
        <Container>
          <nav className="flex items-center justify-between h-16 md:h-18">
            <Logo />

            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200 relative",
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {location.pathname === link.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <ThemeToggle />
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="User menu"
                    >
                      <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 size-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/family" className="cursor-pointer">
                        <Users className="mr-2 size-4" /> Family
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/alerts" className="cursor-pointer">
                        <Bell className="mr-2 size-4" /> Alerts
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 size-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="text-destructive cursor-pointer"
                    >
                      <LogOut className="mr-2 size-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    Sign In
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden text-muted-foreground hover:text-foreground"
                onClick={toggleMobileNav}
                aria-label="Menu"
              >
                {isMobileNavOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </Button>
            </div>
          </nav>
        </Container>
      </motion.header>

      <MobileNav />
    </>
  );
}
