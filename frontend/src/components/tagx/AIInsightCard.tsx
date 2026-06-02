import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface AIInsightCardProps {
  title: string;
  description: string;
  type: 'insight' | 'prediction' | 'alert' | 'suggestion';
  timestamp?: string;
  confidence?: number;
  actionable?: boolean;
  className?: string;
  onAction?: () => void;
}

const typeConfig = {
  insight: { icon: Lightbulb, color: 'text-primary' },
  prediction: { icon: TrendingUp, color: 'text-ai' },
  alert: { icon: AlertTriangle, color: 'text-warning' },
  suggestion: { icon: Sparkles, color: 'text-primary' },
};

export function AIInsightCard({
  title,
  description,
  type,
  timestamp,
  confidence,
  actionable,
  className,
  onAction,
}: AIInsightCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className={cn("group relative overflow-hidden transition-all duration-200", className)}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
              type === 'alert' ? 'bg-warning/10' : 'bg-muted'
            )}>
              <Icon className={cn("w-4.5 h-4.5", config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-sm text-foreground">{title}</p>
                {confidence && (
                  <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-border">
                    {Math.round(confidence * 100)}%
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              <div className="flex items-center gap-3 mt-3">
                {timestamp && (
                  <span className="text-[11px] text-muted-foreground">{timestamp}</span>
                )}
                {actionable && (
                  <button
                    onClick={onAction}
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                  >
                    View details <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
