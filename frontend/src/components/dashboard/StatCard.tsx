import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: number; positive: boolean };
  className?: string;
  variant?: 'default' | 'primary' | 'ai';
}

const variantStyles = {
  default: { iconBg: 'bg-surface-elevated', iconColor: 'text-foreground' },
  primary: { iconBg: 'bg-primary/10', iconColor: 'text-primary' },
  ai: { iconBg: 'bg-ai/10', iconColor: 'text-ai' },
};

export function StatCard({ label, value, icon: Icon, trend, className, variant = 'default' }: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className={cn("transition-all duration-200", className)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-muted-foreground">{label}</p>
            {Icon && (
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", styles.iconBg)}>
                <Icon className={cn("w-4.5 h-4.5", styles.iconColor)} />
              </div>
            )}
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-semibold text-foreground tabular-nums">{value}</p>
            {trend && (
              <span className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                trend.positive ? 'text-primary' : 'text-destructive'
              )}>
                {trend.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {trend.value}%
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
