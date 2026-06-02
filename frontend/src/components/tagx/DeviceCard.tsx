import { motion } from 'framer-motion';
import { MapPin, MoreVertical, Bluetooth, Wifi, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BatteryIndicator } from './BatteryIndicator';
import { SignalStrengthIndicator } from './SignalStrengthIndicator';
import { TrackingStatusBadge } from './TrackingStatusBadge';
import { cn } from '@/lib/utils';

export interface DeviceCardProps {
  name: string;
  type: 'tag' | 'phone' | 'wallet' | 'pet' | 'key';
  status: 'active' | 'idle' | 'offline' | 'low_battery';
  batteryLevel: number;
  signalStrength: number;
  lastSeen: string;
  location?: string;
  accuracy?: string;
  temperature?: number;
  className?: string;
  onAction?: () => void;
}

const typeIcons = {
  tag: Bluetooth,
  phone: Wifi,
  wallet: RefreshCw,
  pet: MapPin,
  key: MapPin,
};

export function DeviceCard({
  name,
  type,
  status,
  batteryLevel,
  signalStrength,
  lastSeen,
  location,
  accuracy,
  className,
}: DeviceCardProps) {
  const Icon = typeIcons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className={cn("group relative overflow-hidden transition-all duration-200", className)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center">
                <Icon className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{name}</p>
                <p className="text-xs text-muted-foreground capitalize">{type}</p>
              </div>
            </div>
            <button className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors duration-200 opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Battery</p>
              <BatteryIndicator level={batteryLevel} />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Signal</p>
              <SignalStrengthIndicator strength={signalStrength} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex-shrink-0">
                <TrackingStatusBadge status={status} />
              </div>
              {location && (
                <span className="text-xs text-muted-foreground truncate">{location}</span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground whitespace-nowrap ml-2">{lastSeen}</span>
          </div>

          {accuracy && (
            <p className="text-[11px] text-muted-foreground mt-2">±{accuracy} accuracy</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
