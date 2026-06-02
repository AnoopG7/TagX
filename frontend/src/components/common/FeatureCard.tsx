import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function FeatureCard({
  icon: Icon,
  title,
  description,
  accent = "cyan",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: "cyan" | "warm";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <div
        className={cn(
          "group relative p-6 rounded-xl bg-surface border border-border transition-all duration-200",
          accent === "cyan"
            ? "hover:border-primary/30 hover:shadow-glow-primary"
            : "hover:border-warning/30 hover:shadow-glow-warning"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            accent === "cyan"
              ? "bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent"
              : "bg-gradient-to-br from-warning/[0.03] via-transparent to-transparent"
          )}
        />
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-200",
            accent === "cyan"
              ? "bg-primary/10 text-primary group-hover:bg-primary/15 group-hover:shadow-glow-primary"
              : "bg-warning/10 text-warning group-hover:bg-warning/15 group-hover:shadow-glow-warning"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-display font-semibold text-lg text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
