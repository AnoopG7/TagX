import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      className="text-muted-foreground hover:text-foreground relative"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {theme === "light" ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )}
      </motion.div>
    </Button>
  );
}
