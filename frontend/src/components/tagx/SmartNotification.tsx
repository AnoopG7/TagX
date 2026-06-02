import { motion } from 'framer-motion';
import { X, ChevronRight, Sparkles, MapPin, Shield, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SmartNotificationProps {
  title: string;
  description: string;
  type: 'location' | 'security' | 'insight' | 'reminder';
  timestamp?: string;
  read?: boolean;
  actionable?: boolean;
  className?: string;
  onDismiss?: () => void;
  onAction?: () => void;
}

const typeConfig = {
  location: { icon: MapPin, color: 'text-primary' },
  security: { icon: Shield, color: 'text-ai' },
  insight: { icon: Sparkles, color: 'text-warning' },
  reminder: { icon: Clock, color: 'text-muted-foreground' },
};

export function SmartNotification({
  title,
  description,
  type,
  timestamp,
  read = false,
  actionable,
  className,
  onDismiss,
  onAction,
}: SmartNotificationProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex items-start gap-3 p-4 rounded-lg border transition-all duration-200",
        read ? 'bg-background border-border' : 'bg-muted border-primary/20',
        className
      )}
    >
      {!read && (
        <span className="absolute top-4 right-10 w-1.5 h-1.5 rounded-full bg-primary" />
      )}
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
        read ? 'bg-muted' : 'bg-muted/50'
      )}>
        <Icon className={cn("w-4 h-4", config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn("text-sm", read ? 'text-muted-foreground' : 'text-foreground font-medium')}>{title}</p>
          {timestamp && <span className="text-[11px] text-muted-foreground ml-auto">{timestamp}</span>}
        </div>
        <p className={cn("text-sm mt-0.5", read ? 'text-muted-foreground/70' : 'text-muted-foreground')}>{description}</p>
        {actionable && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors mt-2"
          >
            View <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="w-6 h-6 rounded-md hover:bg-muted flex items-center justify-center shrink-0 transition-colors duration-200 opacity-0 group-hover:opacity-100"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      )}
    </motion.div>
  );
}
