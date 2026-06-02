import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Wifi, Plus, Scan, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { DeviceCard } from "@/components/tagx/DeviceCard";
import { ActivityTimeline } from "@/components/tagx/ActivityTimeline";
import { PageLayout } from "@/components/shared";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { formatRelativeTime } from "@/lib/utils";
import { containerVariants, itemVariants } from "@/lib/animations";
import type { TrackingDevice, TrackingEvent } from "@/types/device.types";
import type { TimelineEvent } from "@/components/tagx/ActivityTimeline";

const quickActions = [
  {
    label: "Scan for Trackers",
    icon: Scan,
    variant: "default" as const,
    onClick: () => toast.info("Scanning for nearby trackers..."),
  },
  {
    label: "Add Device",
    icon: Plus,
    variant: "secondary" as const,
    onClick: () => toast.info("Feature coming soon"),
  },
  {
    label: "View Alerts",
    icon: Bell,
    variant: "secondary" as const,
    onClick: () => toast.info("No new alerts"),
  },
];

function mapEvent(event: TrackingEvent): TimelineEvent {
  return {
    id: event._id,
    type: event.type,
    title: event.title,
    description: event.description,
    timestamp: formatRelativeTime(event.timestamp),
    icon: event.icon,
  };
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [devices, setDevices] = useState<TrackingDevice[]>([]);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data: devRes } = await api.get("/devices");
        const fetchedDevices: TrackingDevice[] = devRes.data.devices ?? [];
        if (cancelled) return;
        setDevices(fetchedDevices);
        if (fetchedDevices.length > 0) {
          const firstId = fetchedDevices[0]._id;
          const { data: evtRes } = await api.get(`/devices/${firstId}/events?limit=5`);
          if (!cancelled) setEvents(evtRes.data.events ?? []);
        }
      } catch {
        if (!cancelled) toast.error("Failed to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() => {
    const total = devices.length;
    const active = devices.filter((d) => d.status === "active").length;
    const alertsToday = events.filter(
      (e) => e.severity === "error" || e.severity === "critical"
    ).length;
    const recoveryRate = total > 0 ? Math.round((active / total) * 100) : 0;
    return { total, active, alertsToday, recoveryRate };
  }, [devices, events]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  if (loading) {
    return (
      <PageLayout>
        <LoadingState text="Loading dashboard..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-h1 text-foreground">
            Welcome back, {user?.name ?? "User"}
          </h1>
          <p className="text-body-small text-muted-foreground mt-1">{today}</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <MetricCard label="Total Devices" value={stats.total} sublabel="All registered devices" />
          <MetricCard
            label="Active Now"
            value={stats.active}
            sublabel="Currently online"
            progress={stats.total > 0 ? (stats.active / stats.total) * 100 : 0}
            progressColor="primary"
          />
          <MetricCard
            label="Alerts Today"
            value={stats.alertsToday}
            sublabel="Require attention"
            progressColor={stats.alertsToday > 0 ? "warning" : "primary"}
          />
          <MetricCard
            label="Recovery Rate"
            value={`${stats.recoveryRate}%`}
            sublabel="Device uptime ratio"
            progress={stats.recoveryRate}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Button key={action.label} variant={action.variant} onClick={action.onClick} className="gap-2">
              <action.icon className="w-4 h-4" />
              {action.label}
            </Button>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-h4 text-foreground">Your Devices</h2>
          {devices.length === 0 ? (
            <EmptyState
              icon={Wifi}
              title="No devices yet"
              description="Add your first tracking device to start monitoring."
              action={<Button onClick={() => toast.info("Feature coming soon")}><Plus className="w-4 h-4 mr-1" />Add Device</Button>}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device) => (
                <motion.div
                  key={device._id}
                  variants={itemVariants}
                  className="cursor-pointer"
                  onClick={() => navigate(`/devices/${device._id}`)}
                >
                  <DeviceCard
                    name={device.name}
                    type={device.type}
                    status={device.status}
                    batteryLevel={device.batteryLevel}
                    signalStrength={device.signalStrength}
                    lastSeen={formatRelativeTime(device.lastSeen)}
                    location={device.location?.address}
                    accuracy={device.location?.accuracy ? `${device.location.accuracy}m` : undefined}
                    temperature={device.temperature}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {events.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-h4 text-foreground">Recent Events</h2>
            <div className="rounded-xl border border-border bg-card p-5">
              <ActivityTimeline events={events.map(mapEvent)} maxItems={5} />
            </div>
          </motion.div>
        )}
      </motion.div>
    </PageLayout>
  );
}
