import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MapPin, Bluetooth, Wifi, Power, AlertTriangle } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  type: 'location' | 'connection' | 'alert' | 'status';
  title: string;
  description: string;
  timestamp: string;
  icon?: 'map-pin' | 'bluetooth' | 'wifi' | 'power' | 'alert';
}

export interface ActivityTimelineProps {
  events: TimelineEvent[];
  className?: string;
  maxItems?: number;
}

const eventIcons = {
  'map-pin': MapPin,
  bluetooth: Bluetooth,
  wifi: Wifi,
  power: Power,
  alert: AlertTriangle,
};

const typeColors = {
  location: 'text-primary',
  connection: 'text-ai',
  alert: 'text-warning',
  status: 'text-muted-foreground',
};

export function ActivityTimeline({ events, className, maxItems }: ActivityTimelineProps) {
  const display = maxItems ? events.slice(0, maxItems) : events;

  return (
    <div className={cn("space-y-0", className)}>
      {display.map((event, index) => {
        const Icon = event.icon ? eventIcons[event.icon] : MapPin;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            className="relative flex gap-4 pb-6 last:pb-0"
          >
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center bg-muted shrink-0",
                typeColors[event.type]
              )}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              {index < display.length - 1 && (
                <div className="w-px flex-1 bg-border mt-1" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                <span className="text-[11px] text-muted-foreground ml-auto shrink-0">{event.timestamp}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{event.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
