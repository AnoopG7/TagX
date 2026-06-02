import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Maximize2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface DeviceLocationCardProps {
  deviceName: string;
  address?: string;
  coordinates: { lat: number; lng: number };
  lastUpdated: string;
  accuracy?: string;
  isMoving?: boolean;
  className?: string;
}

export function DeviceLocationCard({
  deviceName,
  address,
  coordinates,
  lastUpdated,
  accuracy,
  isMoving,
  className,
}: DeviceLocationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className={cn("relative overflow-hidden transition-all duration-200", className)}>
        <div className="h-40 bg-gradient-to-br from-surface-elevated to-background flex items-center justify-center relative">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
            </p>
          </div>
          {isMoving && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-3 right-3"
            >
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-primary/5">
                <Navigation className="w-3 h-3 mr-1" />
                Moving
              </Badge>
            </motion.div>
          )}
        </div>
        <CardContent className="p-4">
          <p className="font-medium text-sm text-foreground mb-1">{deviceName}</p>
          {address && (
            <p className="text-sm text-muted-foreground leading-relaxed">{address}</p>
          )}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
              <Clock className="w-3 h-3" /> {lastUpdated}
            </span>
            {accuracy && (
              <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                <Maximize2 className="w-3 h-3" /> ±{accuracy}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
