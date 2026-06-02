import { motion } from 'framer-motion';
import { User, Users, MapPin, Bluetooth, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TrackingStatusBadge } from './TrackingStatusBadge';
import type { TrackingStatus } from './TrackingStatusBadge';
import { cn } from '@/lib/utils';

export interface FamilyMemberCardProps {
  name: string;
  role: string;
  avatar?: string;
  devices: number;
  status: TrackingStatus;
  lastSeen?: string;
  location?: string;
  isOwner?: boolean;
  className?: string;
}

export function FamilyMemberCard({
  name,
  role,
  avatar,
  devices,
  status,
  location,
  isOwner,
  className,
}: FamilyMemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("group transition-all duration-200", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              {avatar ? (
                <img src={avatar} alt={name} className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              {isOwner && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <Users className="w-2.5 h-2.5 text-primary-foreground" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm text-foreground">{name}</p>
                <span className="text-[11px] text-muted-foreground">{role}</span>
                <TrackingStatusBadge status={status} size="sm" className="ml-auto" />
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Bluetooth className="w-3 h-3" /> {devices} device{devices !== 1 ? 's' : ''}
                </span>
                {location && (
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {location}
                  </span>
                )}
              </div>
            </div>
            <button className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
