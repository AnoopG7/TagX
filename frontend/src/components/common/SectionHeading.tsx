import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  accent = "cyan",
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  accent?: "cyan" | "warm";
}) {
  return (
    <div className={cn("mb-8", align === "center" && "text-center")}>
      <div className="inline-flex items-center gap-2 mb-3">
        <div
          className={cn(
            "h-[2px] rounded-full transition-all duration-500",
            accent === "cyan" ? "bg-primary" : "bg-warning",
            align === "center" ? "w-6" : "w-6"
          )}
        />
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          TagX
        </span>
      </div>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: accent === "cyan" ? 80 : 60 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "h-0.5 mt-4 rounded-full",
          accent === "cyan" ? "bg-primary" : "bg-warning",
          align === "center" ? "mx-auto" : ""
        )}
      />
    </div>
  );
}
