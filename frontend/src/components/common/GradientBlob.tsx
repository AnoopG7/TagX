import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GradientBlob({
  color = "cyan",
  size = "lg",
  className,
}: {
  color?: "cyan" | "warm" | "mixed";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeMap = {
    sm: "w-48 h-48",
    md: "w-72 h-72",
    lg: "w-96 h-96",
  };

  const colorMap = {
    cyan: "from-primary/20 via-blue-500/10 to-transparent",
    warm: "from-warning/20 via-orange-500/10 to-transparent",
    mixed: "from-primary/15 via-purple-500/10 to-warning/10",
  };

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "absolute rounded-full blur-3xl pointer-events-none bg-gradient-to-br",
        sizeMap[size],
        colorMap[color],
        className
      )}
    />
  );
}
