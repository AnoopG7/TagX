import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Square,
  RotateCcw,
  Crosshair,
  Navigation,
  Clock,
  Ruler,
  Zap,
  MapPin,
  Radio,
  Battery,
  Signal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveTrackingMap } from "@/components/maps/LiveTrackingMap";
import { RouteHistoryMap } from "@/components/maps/RouteHistoryMap";
import { useDeviceSimulation } from "@/hooks/useDeviceSimulation";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import type { TrackingDevice } from "@/types/device.types";

type TabMode = "live" | "route";

const DEFAULT_LAT = 19.0596;
const DEFAULT_LNG = 72.8656;

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

export default function TrackingPage() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();

  const [device, setDevice] = useState<TrackingDevice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [activeTab, setActiveTab] = useState<TabMode>("live");
  const [followMarker, setFollowMarker] = useState(true);

  useEffect(() => {
    if (!deviceId) {
      setError(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/devices/${deviceId}`);
        if (cancelled) return;
        setDevice(data.data.device);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [deviceId]);

  const startLat = device?.location?.lat ?? DEFAULT_LAT;
  const startLng = device?.location?.lng ?? DEFAULT_LNG;

  const {
    currentLocation,
    locationHistory,
    isTracking,
    elapsedMs,
    totalDistanceM,
    startTracking,
    stopTracking,
    resetHistory,
  } = useDeviceSimulation({
    startLat,
    startLng,
    intervalMs: 3000,
    baseSpeed: 1.4,
  });

  const liveTrail = useMemo(
    () => locationHistory.slice(-25),
    [locationHistory],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Skeleton className="h-[60vh] w-full rounded-xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-44 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="min-h-screen bg-background pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-muted-foreground">Device not found</p>
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-4 border-b border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-1.5 mb-3 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Crosshair className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-display font-semibold text-foreground">
                    {device.name}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Live Device Tracking
                  </p>
                </div>
                {isTracking && (
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-primary bg-primary/5 text-[10px] animate-pulse"
                  >
                    <Radio className="w-3 h-3 mr-1" />
                    LIVE
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 p-1 rounded-lg bg-surface border border-border">
                {(["live", "route"] as TabMode[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 capitalize",
                      activeTab === tab
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab === "live" ? (
                      <span className="flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5" />
                        Live
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5" />
                        Route
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              {activeTab === "live" ? (
                <motion.div
                  key="live-map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ height: "calc(100vh - 240px)", minHeight: 500 }}
                >
                  <LiveTrackingMap
                    currentLocation={currentLocation}
                    trail={liveTrail}
                    followMarker={followMarker}
                    className="h-full"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="route-map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ height: "calc(100vh - 240px)", minHeight: 500 }}
                >
                  <RouteHistoryMap
                    history={locationHistory}
                    className="h-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-sm font-display font-semibold text-foreground">
                  Device Status
                </h3>
                <div className="space-y-3">
                  <InfoRow
                    icon={Battery}
                    label="Battery"
                    value={`${device.batteryLevel}%`}
                    accent={device.batteryLevel > 50 ? "green" : "amber"}
                  />
                  <InfoRow
                    icon={Signal}
                    label="Signal"
                    value={`${device.signalStrength}%`}
                    accent="green"
                  />
                  <InfoRow
                    icon={Zap}
                    label="Speed"
                    value={`${currentLocation.speed.toFixed(1)} m/s`}
                  />
                  <InfoRow
                    icon={Navigation}
                    label="Heading"
                    value={`${Math.round(currentLocation.heading)}°`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-display font-semibold text-foreground">
                  Position
                </h3>
                <div className="p-3 rounded-lg bg-surface border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      Coordinates
                    </span>
                  </div>
                  <p className="text-sm font-mono text-foreground">
                    {currentLocation.lat.toFixed(6)}
                  </p>
                  <p className="text-sm font-mono text-foreground">
                    {currentLocation.lng.toFixed(6)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-display font-semibold text-foreground">
                  Session Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <StatBlock
                    icon={Clock}
                    label="Duration"
                    value={formatDuration(elapsedMs)}
                  />
                  <StatBlock
                    icon={Ruler}
                    label="Distance"
                    value={formatDistance(totalDistanceM)}
                  />
                  <StatBlock
                    icon={MapPin}
                    label="Points"
                    value={String(locationHistory.length)}
                  />
                  <StatBlock
                    icon={Zap}
                    label="Avg Speed"
                    value={
                      elapsedMs > 0
                        ? `${((totalDistanceM / (elapsedMs / 1000))).toFixed(1)} m/s`
                        : "—"
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-display font-semibold text-foreground">
                  Simulation Controls
                </h3>
                <div className="flex flex-col gap-2">
                  {!isTracking ? (
                    <Button
                      onClick={startTracking}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Start Tracking
                    </Button>
                  ) : (
                    <Button
                      onClick={stopTracking}
                      variant="destructive"
                      className="w-full font-semibold gap-2"
                    >
                      <Square className="w-4 h-4" />
                      Stop Tracking
                    </Button>
                  )}
                  <Button
                    onClick={resetHistory}
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-surface-hover font-medium gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
                {activeTab === "live" && (
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={followMarker}
                      onChange={(e) => setFollowMarker(e.target.checked)}
                      className="rounded border-border accent-primary"
                    />
                    <span className="text-xs text-muted-foreground">
                      Auto-follow marker
                    </span>
                  </label>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: "green" | "amber" | "red";
}) {
  const accentColor =
    accent === "green"
      ? "text-emerald-400"
      : accent === "amber"
        ? "text-amber-400"
        : accent === "red"
          ? "text-red-400"
          : "text-foreground";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className={cn("text-sm font-mono font-medium", accentColor)}>
        {value}
      </span>
    </div>
  );
}

function StatBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="p-2.5 rounded-lg bg-surface border border-border text-center">
      <Icon className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
      <p className="text-xs font-mono font-semibold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
