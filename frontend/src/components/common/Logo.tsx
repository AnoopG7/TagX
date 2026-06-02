import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function Logo({
  size = "default",
  showText = true,
}: {
  size?: "sm" | "default" | "lg";
  showText?: boolean;
}) {
  const sizeMap = {
    sm: { ring: "w-6 h-6", dot: "w-2 h-2", text: "text-base" },
    default: { ring: "w-8 h-8", dot: "w-2.5 h-2.5", text: "text-xl" },
    lg: { ring: "w-11 h-11", dot: "w-3.5 h-3.5", text: "text-2xl" },
  };

  const s = sizeMap[size];

  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className={`relative ${s.ring} flex items-center justify-center`}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-emerald-400 opacity-20 blur-sm group-hover:opacity-30 transition-opacity duration-300" />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: "1.5px solid", borderColor: "hsl(var(--primary))" }}
          animate={{
            scale: [1, 1.6, 2.2],
            opacity: [0.5, 0.15, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        <div
          className={`${s.dot} rounded-full bg-gradient-to-br from-primary to-emerald-400 shadow-lg shadow-primary/20 transition-all duration-300 group-hover:shadow-primary/40`}
        />
      </div>

      {showText && (
        <span
          className={`font-display font-bold ${s.text} tracking-tight text-foreground`}
        >
          Tag
          <span className="text-primary">X</span>
        </span>
      )}
    </Link>
  );
}
