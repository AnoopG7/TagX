import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader } from '@/components/common/Loader';

export interface LoadingStateProps {
  text?: string;
  className?: string;
  fullScreen?: boolean;
  variant?: 'spinner' | 'skeleton';
  count?: number;
}

export function LoadingState({
  text = 'Loading...',
  className,
  fullScreen = false,
  variant = 'spinner',
  count = 3,
}: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div className={cn("space-y-4", fullScreen && "p-8", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className="p-5 rounded-lg border border-border bg-card"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader text={text} fullScreen={fullScreen} />
    </div>
  );
}
