import { motion } from 'framer-motion';
import { Shield, ShieldCheck, ShieldAlert, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PrivacyAlertCardProps {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp?: string;
  location?: string;
  actionLabel?: string;
  className?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const severityConfig = {
  info: { icon: ShieldCheck, color: 'text-primary', bg: 'bg-primary/5', badge: 'bg-primary/10 text-primary border-0' },
  warning: { icon: ShieldAlert, color: 'text-warning', bg: 'bg-warning/5', badge: 'bg-warning/10 text-warning border-0' },
  critical: { icon: Shield, color: 'text-destructive', bg: 'bg-destructive/5', badge: 'bg-destructive/10 text-destructive border-0' },
};

export function PrivacyAlertCard({
  title,
  description,
  severity,
  timestamp,
  location,
  actionLabel,
  className,
  onAction,
  onDismiss,
}: PrivacyAlertCardProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className={cn("relative overflow-hidden border-l-[3px] transition-all duration-200", className)}
        style={{ borderLeftColor: severity === 'critical' ? 'var(--destructive)' : severity === 'warning' ? 'var(--warning)' : 'var(--primary)' }}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
              <Icon className={cn("w-4.5 h-4.5", config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={cn("text-[10px] h-5 px-2 font-medium", config.badge)}>
                  {severity === 'critical' ? 'Critical' : severity === 'warning' ? 'Warning' : 'Info'}
                </Badge>
                {timestamp && (
                  <span className="text-[11px] text-muted-foreground">{timestamp}</span>
                )}
              </div>
              <p className="font-medium text-sm text-foreground mb-1">{title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  {location && (
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {location}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {onDismiss && (
                    <Button variant="ghost" size="xs" onClick={onDismiss}>Dismiss</Button>
                  )}
                  {actionLabel && onAction && (
                    <Button size="xs" onClick={onAction}>{actionLabel}</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
