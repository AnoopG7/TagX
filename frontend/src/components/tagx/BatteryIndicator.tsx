import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Zap, BatteryWarning, BatteryCharging } from 'lucide-react';

export interface BatteryIndicatorProps {
  level: number;
  charging?: boolean;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'default';
}

export function BatteryIndicator({ level, charging, className, showIcon = true, size = 'default' }: BatteryIndicatorProps) {
  const clamped = Math.max(0, Math.min(100, level));

  const getColor = () => {
    if (clamped <= 10) return 'bg-destructive';
    if (clamped <= 25) return 'bg-warning';
    return 'bg-primary';
  };

  const getIcon = () => {
    if (charging) return BatteryCharging;
    if (clamped <= 10) return BatteryWarning;
    return Zap;
  };

  const Icon = getIcon();
  const iconColor = clamped <= 10 ? 'text-destructive' : clamped <= 25 ? 'text-warning' : 'text-primary';

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "relative rounded-full bg-muted overflow-hidden",
        size === 'sm' ? 'w-12 h-1.5' : 'w-16 h-2'
      )}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={cn("h-full rounded-full transition-colors duration-200", getColor())}
        />
      </div>
      <span className={cn("tabular-nums text-muted-foreground", size === 'sm' ? 'text-[10px]' : 'text-xs')}>
        {clamped}%
      </span>
      {showIcon && <Icon className={cn("w-3.5 h-3.5", iconColor)} />}
    </div>
  );
}
