import { motion } from "framer-motion";

export function Loader({
  fullScreen = false,
  text,
}: {
  fullScreen?: boolean;
  text?: string;
}) {
  const spinner = (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-10 h-10">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[var(--color-border)]"
          style={{ borderTopColor: "hsl(var(--primary))" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-1 rounded-full"
          style={{
            background: `linear-gradient(135deg, hsl(var(--primary)), #4ADE80)`,
          }}
          animate={{
            scale: [1, 0.6, 1],
            opacity: [1, 0.4, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
      {text && (
        <motion.p
          className="text-sm text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}
