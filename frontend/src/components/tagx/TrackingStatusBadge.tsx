import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Circle, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export type TrackingStatus = 'active' | 'idle' | 'offline' | 'low_battery';

export interface TrackingStatusProps {
  status: TrackingStatus;
  className?: string;
  size?: 'sm' | 'default';
}

const statusConfig: Record<TrackingStatus, { label: string; icon: typeof Circle; color: string; bg: string }> = {
  active: { label: 'Active', icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10' },
  idle: { label: 'Idle', icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' },
  offline: { label: 'Offline', icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  low_battery: { label: 'Low Battery', icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10' },
};

export function TrackingStatusBadge({ status, className, size = 'default' }: TrackingStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium transition-colors duration-200",
        config.bg,
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[11px]',
        className
      )}
    >
      <Icon className={cn("shrink-0", config.color, size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3')} />
      {config.label}
    </motion.span>
  );
}
