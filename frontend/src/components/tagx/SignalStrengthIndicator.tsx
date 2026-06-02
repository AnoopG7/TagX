import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { WifiOff } from 'lucide-react';

export interface SignalStrengthIndicatorProps {
  strength: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'default';
}

export function SignalStrengthIndicator({ strength, className, showLabel = false, size = 'default' }: SignalStrengthIndicatorProps) {
  const clamped = Math.max(0, Math.min(100, strength));
  const bars = 4;
  const activeBars = Math.round((clamped / 100) * bars);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-end gap-[2px]">
        {Array.from({ length: bars }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${((i + 1) / bars) * 100}%` }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={cn(
              "w-[3px] rounded-full transition-colors duration-200",
              i < activeBars
                ? strength > 60 ? 'bg-primary' : strength > 30 ? 'bg-warning' : 'bg-destructive'
                : 'bg-muted',
              size === 'sm' ? 'h-2.5' : 'h-3'
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className={cn("tabular-nums text-muted-foreground", size === 'sm' ? 'text-[10px]' : 'text-xs')}>
          {clamped}%
        </span>
      )}
      {clamped === 0 && <WifiOff className="w-3 h-3 text-destructive" />}
    </div>
  );
}
