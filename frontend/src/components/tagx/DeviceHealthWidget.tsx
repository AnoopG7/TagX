import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Wifi, BatteryCharging, Thermometer, Clock, HardDrive } from 'lucide-react';

export interface DeviceHealthWidgetProps {
  uptime: number;
  signalStrength: number;
  batteryHealth: number;
  temperature: number;
  lastCalibrated?: string;
  firmwareVersion?: string;
  className?: string;
}

const metrics = [
  { key: 'uptime', label: 'Uptime', icon: Clock, value: null, unit: '%', color: 'text-primary' },
  { key: 'signal', label: 'Signal', icon: Wifi, value: null, unit: '%', color: 'text-ai' },
  { key: 'battery', label: 'Battery Health', icon: BatteryCharging, value: null, unit: '%', color: 'text-primary' },
  { key: 'temp', label: 'Temperature', icon: Thermometer, value: null, unit: '°C', color: 'text-warning' },
];

export function DeviceHealthWidget({
  uptime,
  signalStrength,
  batteryHealth,
  temperature,
  lastCalibrated,
  firmwareVersion,
  className,
}: DeviceHealthWidgetProps) {
  const values: Record<string, { value: number; unit: string }> = {
    uptime: { value: uptime, unit: '%' },
    signal: { value: signalStrength, unit: '%' },
    battery: { value: batteryHealth, unit: '%' },
    temp: { value: temperature, unit: '°C' },
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const data = values[metric.key];

          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-surface-elevated border border-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">{metric.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold text-foreground tabular-nums">{data.value}</span>
                <span className="text-xs text-muted-foreground">{data.unit}</span>
              </div>
              <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, data.value)}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "h-full rounded-full",
                    metric.key === 'temp' ? 'bg-warning' : 'bg-primary'
                  )}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
        {lastCalibrated && (
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" /> Calibrated {lastCalibrated}
          </span>
        )}
        {firmwareVersion && (
          <span className="inline-flex items-center gap-1">
            <HardDrive className="w-3 h-3" /> v{firmwareVersion}
          </span>
        )}
      </div>
    </div>
  );
}
