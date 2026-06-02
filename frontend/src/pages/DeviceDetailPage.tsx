import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, HardDrive, Cpu, Package, Calendar, Pencil, Check, Trash2, Crosshair } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrackingStatusBadge } from "@/components/tagx/TrackingStatusBadge";
import { BatteryIndicator } from "@/components/tagx/BatteryIndicator";
import { SignalStrengthIndicator } from "@/components/tagx/SignalStrengthIndicator";
import { DeviceLocationCard } from "@/components/tagx/DeviceLocationCard";
import { DeviceHealthWidget } from "@/components/tagx/DeviceHealthWidget";
import { ActivityTimeline } from "@/components/tagx/ActivityTimeline";
import type { TimelineEvent } from "@/components/tagx/ActivityTimeline";
import { LoadingState } from "@/components/shared/LoadingState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageLayout } from "@/components/shared/PageLayout";
import { containerVariants, itemVariants } from "@/lib/animations";
import api from "@/lib/api";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import type {
  TrackingDevice,
  TrackingEvent,
  DeviceHealth,
} from "@/types/device.types";

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

export default function DeviceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [device, setDevice] = useState<TrackingDevice | null>(null);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [healthRecords, setHealthRecords] = useState<DeviceHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [eventPage, setEventPage] = useState(1);
  const [eventTotal, setEventTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const editRef = useRef<HTMLInputElement>(null);

  const fetchEvents = useCallback(
    async (pageNum: number, append = false) => {
      try {
        if (append) setLoadingMore(true);
        const { data } = await api.get(
          `/devices/${id}/events?page=${pageNum}&limit=10`
        );
        const incoming: TrackingEvent[] = data.data.events ?? [];
        setEvents((prev) => (append ? [...prev, ...incoming] : incoming));
        setEventTotal(data.data.pagination?.total ?? incoming.length);
      } catch {
        toast.error("Failed to load events");
      } finally {
        if (append) setLoadingMore(false);
      }
    },
    [id]
  );

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(false);
      try {
        const [devRes, evtRes, healthRes] = await Promise.all([
          api.get(`/devices/${id}`),
          api.get(`/devices/${id}/events?page=1&limit=10`),
          api.get(`/devices/${id}/health`),
        ]);

        if (cancelled) return;

        setDevice(devRes.data.data.device);
        setEvents(evtRes.data.data.events ?? []);
        setEventTotal(evtRes.data.data.pagination?.total ?? 0);
        setHealthRecords(healthRes.data.data.records ?? []);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleLoadMore = async () => {
    const next = eventPage + 1;
    setEventPage(next);
    await fetchEvents(next, true);
  };

  const handleStartEdit = () => {
    setEditName(device!.name);
    setEditing(true);
    setTimeout(() => editRef.current?.focus(), 50);
  };

  const handleSaveName = async () => {
    const trimmed = editName.trim();
    if (!trimmed || trimmed === device!.name) {
      setEditing(false);
      return;
    }
    if (trimmed.length > 60) {
      toast.error("Name cannot exceed 60 characters");
      return;
    }
    try {
      const { data } = await api.patch(`/devices/${id}`, { name: trimmed });
      setDevice(data.data.device);
      setEditing(false);
      toast.success("Device renamed");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to rename device";
      toast.error(msg);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditName(device!.name);
  };

  const handleRemoveDevice = async () => {
    setDeleting(true);
    try {
      await api.delete(`/devices/${id}`);
      toast.success("Device removed");
      setDeleteOpen(false);
      navigate("/dashboard");
    } catch {
      toast.error("Failed to remove device");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <LoadingState text="Loading device..." />
      </PageLayout>
    );
  }

  if (error || !device) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-muted-foreground">Device not found</p>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </PageLayout>
    );
  }

  const latestHealth = healthRecords.length > 0 ? healthRecords[0] : null;
  const hasMore = events.length < eventTotal;

  return (
    <PageLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="gap-1.5 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <PageHeader
            title={
              <div className="flex items-center gap-3 flex-wrap">
                {editing ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Input
                      ref={editRef}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      className="h-8 w-48"
                    />
                    <Button size="icon-xs" variant="ghost" onClick={handleSaveName}>
                      <Check className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-xl sm:text-2xl">{device.name}</span>
                )}
                <div className="flex items-center gap-1">
                  {!editing && (
                    <Button size="icon-xs" variant="ghost" onClick={handleStartEdit}>
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  )}
                  <Button size="icon-xs" variant="ghost" className="text-muted-foreground hover:text-primary" onClick={() => navigate(`/track/${id}`)}>
                    <Crosshair className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon-xs" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => setDeleteOpen(true)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <TrackingStatusBadge status={device.status} />
                <Badge variant="outline" className="capitalize">
                  {device.type}
                </Badge>
              </div>
            }
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {device.location && (
              <motion.div variants={itemVariants}>
                <DeviceLocationCard
                  deviceName={device.name}
                  address={device.location.address}
                  coordinates={{
                    lat: device.location.lat,
                    lng: device.location.lng,
                  }}
                  lastUpdated={formatRelativeTime(device.lastSeen)}
                  accuracy={
                    device.location.accuracy
                      ? `${device.location.accuracy}m`
                      : undefined
                  }
                />
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Activity
              </h2>
              <div className="rounded-xl border bg-card p-5">
                <ActivityTimeline events={events.map(mapEvent)} />
                {hasMore && (
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? "Loading..." : "Load More"}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            {latestHealth && (
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Device Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DeviceHealthWidget
                      uptime={latestHealth.uptime}
                      signalStrength={latestHealth.signalStrength}
                      batteryHealth={latestHealth.batteryHealth}
                      temperature={latestHealth.temperature}
                      firmwareVersion={device.firmwareVersion}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Battery &amp; Signal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">Battery</p>
                    <BatteryIndicator level={device.batteryLevel} />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground">
                      Signal Strength
                    </p>
                    <SignalStrengthIndicator
                      strength={device.signalStrength}
                      showLabel
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Device Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <InfoRow
                    icon={HardDrive}
                    label="Serial"
                    value={device.serialNumber}
                  />
                  <InfoRow
                    icon={Cpu}
                    label="Firmware"
                    value={device.firmwareVersion}
                  />
                  <InfoRow
                    icon={Package}
                    label="Type"
                    value={device.type}
                  />
                  {device.deviceModel && (
                    <InfoRow
                      icon={Cpu}
                      label="Model"
                      value={device.deviceModel}
                    />
                  )}
                  <InfoRow
                    icon={Calendar}
                    label="Paired"
                    value={formatDate(device.pairedAt)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Remove Device"
        description={`Are you sure you want to remove "${device.name}" from your network? This action cannot be undone.`}
        confirmLabel="Remove"
        variant="destructive"
        loading={deleting}
        onConfirm={handleRemoveDevice}
      />
    </PageLayout>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}
