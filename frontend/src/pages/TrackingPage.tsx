import { useState, useMemo } from "react";
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
import { LiveTrackingMap } from "@/components/maps/LiveTrackingMap";
import { RouteHistoryMap } from "@/components/maps/RouteHistoryMap";
import { useDeviceSimulation } from "@/hooks/useDeviceSimulation";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────
// Simulated device metadata
// ──────────────────────────────────────
const MOCK_DEVICES: Record<
  string,
  { name: string; type: string; battery: number; signal: number }
> = {
  demo: {
    name: "Keys — TagX Pro",
    type: "tag",
    battery: 87,
    signal: 92,
  },
  pet: {
    name: "Buddy — TagX Pet",
    type: "pet",
    battery: 64,
    signal: 78,
  },
  vehicle: {
    name: "Honda City — TagX Vehicle",
    type: "vehicle",
    battery: 95,
    signal: 85,
  },
};

type TabMode = "live" | "route";

// ──────────────────────────────────────
// Helpers
// ──────────────────────────────────────

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

// ──────────────────────────────────────
// Component
// ──────────────────────────────────────

export default function TrackingPage() {
  const { deviceId = "demo" } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabMode>("live");
  const [followMarker, setFollowMarker] = useState(true);

  const device = MOCK_DEVICES[deviceId] ?? MOCK_DEVICES["demo"];

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
    // Mumbai — Bandra-Kurla Complex area
    startLat: 19.0596,
    startLng: 72.8656,
    intervalMs: 3000,
    baseSpeed: 1.4,
  });

  // Last 25 points for the live trail
  const liveTrail = useMemo(
    () => locationHistory.slice(-25),
    [locationHistory],
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
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

              {/* Tab Switcher */}
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

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map — 3/4 width */}
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

          {/* Sidebar — 1/4 width */}
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
            {/* Device Info Card */}
            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-sm font-display font-semibold text-foreground">
                  Device Status
                </h3>

                <div className="space-y-3">
                  <InfoRow
                    icon={Battery}
                    label="Battery"
                    value={`${device.battery}%`}
                    accent={device.battery > 50 ? "green" : "amber"}
                  />
                  <InfoRow
                    icon={Signal}
                    label="Signal"
                    value={`${device.signal}%`}
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

            {/* Coordinates Card */}
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

            {/* Stats Card */}
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

            {/* Controls Card */}
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

// ──────────────────────────────────────
// Sub-components
// ──────────────────────────────────────

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
