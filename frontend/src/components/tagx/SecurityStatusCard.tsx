import { motion } from 'framer-motion';
import { Shield, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface SecurityStatusCardProps {
  status: 'secure' | 'warning' | 'compromised';
  devicesProtected: number;
  alertsToday: number;
  lastScan?: string;
  encryptionEnabled?: boolean;
  className?: string;
}

const statusConfig = {
  secure: { icon: ShieldCheck, color: 'text-primary', bg: 'bg-primary/5', label: 'All Secure', badge: 'bg-primary/10 text-primary' },
  warning: { icon: ShieldAlert, color: 'text-warning', bg: 'bg-warning/5', label: 'Attention Needed', badge: 'bg-warning/10 text-warning' },
  compromised: { icon: Shield, color: 'text-destructive', bg: 'bg-destructive/5', label: 'Compromised', badge: 'bg-destructive/10 text-destructive' },
};

export function SecurityStatusCard({
  status,
  devicesProtected,
  alertsToday,
  lastScan,
  encryptionEnabled = true,
  className,
}: SecurityStatusCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className={cn("relative overflow-hidden transition-all duration-200", className)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.bg)}>
                <Icon className={cn("w-5 h-5", config.color)} />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">Security Status</p>
                <Badge className={cn("mt-1 text-[10px] h-5 px-2 font-medium border-0", config.badge)}>
                  {config.label}
                </Badge>
              </div>
            </div>
            {encryptionEnabled && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3 h-3 text-primary" />
                Encrypted
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground">Devices Protected</p>
              <p className="font-semibold text-lg text-foreground tabular-nums">{devicesProtected}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground">Alerts Today</p>
              <p className={cn("font-semibold text-lg tabular-nums", alertsToday > 0 ? 'text-warning' : 'text-foreground')}>{alertsToday}</p>
            </div>
          </div>

          {lastScan && (
            <div className="flex items-center gap-1.5 mt-4 text-[11px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              Last scan: {lastScan}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
