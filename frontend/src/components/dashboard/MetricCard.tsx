import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  progress?: number;
  progressColor?: 'primary' | 'ai' | 'warning';
  className?: string;
}

const progressColors = {
  primary: 'bg-primary',
  ai: 'bg-ai',
  warning: 'bg-warning',
};

export function MetricCard({ label, value, sublabel, progress, progressColor = 'primary', className }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
      <Card className={cn("h-full transition-all duration-200", className)}>
        <CardContent className="p-5 flex flex-col h-full">
          <p className="text-sm text-muted-foreground mb-3">{label}</p>
          <p className="text-3xl font-semibold text-foreground tabular-nums mb-1">{value}</p>
          {sublabel && (
            <p className="text-sm text-muted-foreground mb-4">{sublabel}</p>
          )}
          {!sublabel && <div className="mb-4" />}
          <div className="mt-auto">
            {progress !== undefined && (
              <div className="space-y-1.5">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, progress)}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={cn("h-full rounded-full", progressColors[progressColor])}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">{progress}% target</span>
              </div>
            )}
            {progress === undefined && <div className="h-[38px]" />}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
