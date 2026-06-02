import { useState, useRef, useCallback, useEffect } from "react";

export interface SimulatedPoint {
  lat: number;
  lng: number;
  timestamp: number;
  speed: number; // m/s
  heading: number; // degrees
}

export interface SimulationConfig {
  /** Starting latitude (default: Mumbai — 19.076) */
  startLat?: number;
  /** Starting longitude (default: Mumbai — 72.877) */
  startLng?: number;
  /** Update interval in ms (default: 3000) */
  intervalMs?: number;
  /** Base movement speed in m/s (default: 1.4 — walking pace) */
  baseSpeed?: number;
}

const DEFAULTS: Required<SimulationConfig> = {
  startLat: 19.076,
  startLng: 72.8777,
  intervalMs: 3000,
  baseSpeed: 1.4,
};

// ~111,320 meters per degree latitude
const METERS_PER_DEG_LAT = 111_320;

function metersPerDegLng(lat: number) {
  return 111_320 * Math.cos((lat * Math.PI) / 180);
}

/**
 * Generate the next simulated point with realistic momentum.
 * The heading drifts by ±30° and speed varies ±40% around base.
 */
function nextPoint(
  prev: SimulatedPoint,
  baseSpeed: number,
  intervalMs: number,
): SimulatedPoint {
  // Drift heading by ±30°
  const headingDelta = (Math.random() - 0.5) * 60;
  const heading = (prev.heading + headingDelta + 360) % 360;

  // Speed varies ±40%
  const speed = baseSpeed * (0.6 + Math.random() * 0.8);

  // Distance traveled in this interval (m)
  const distanceM = speed * (intervalMs / 1000);

  const headingRad = (heading * Math.PI) / 180;
  const dLat = (distanceM * Math.cos(headingRad)) / METERS_PER_DEG_LAT;
  const dLng = (distanceM * Math.sin(headingRad)) / metersPerDegLng(prev.lat);

  return {
    lat: prev.lat + dLat,
    lng: prev.lng + dLng,
    timestamp: Date.now(),
    speed,
    heading,
  };
}

export function useDeviceSimulation(config?: SimulationConfig) {
  const cfg = { ...DEFAULTS, ...config };

  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<SimulatedPoint>({
    lat: cfg.startLat,
    lng: cfg.startLng,
    timestamp: Date.now(),
    speed: 0,
    heading: Math.random() * 360,
  });
  const [locationHistory, setLocationHistory] = useState<SimulatedPoint[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const latestRef = useRef(currentLocation);

  // Keep the ref in sync
  useEffect(() => {
    latestRef.current = currentLocation;
  }, [currentLocation]);

  const startTracking = useCallback(() => {
    if (intervalRef.current) return;

    // Record the starting point into history
    const startPt: SimulatedPoint = {
      ...latestRef.current,
      timestamp: Date.now(),
      speed: 0,
    };
    setLocationHistory((prev) => (prev.length === 0 ? [startPt] : prev));
    startTimeRef.current = Date.now() - elapsedMs;
    setIsTracking(true);

    intervalRef.current = setInterval(() => {
      const pt = nextPoint(latestRef.current, cfg.baseSpeed, cfg.intervalMs);
      setCurrentLocation(pt);
      setLocationHistory((prev) => [...prev, pt]);
      setElapsedMs(Date.now() - startTimeRef.current);
    }, cfg.intervalMs);
  }, [cfg.baseSpeed, cfg.intervalMs, elapsedMs]);

  const stopTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);
  }, []);

  const resetHistory = useCallback(() => {
    stopTracking();
    const resetPt: SimulatedPoint = {
      lat: cfg.startLat,
      lng: cfg.startLng,
      timestamp: Date.now(),
      speed: 0,
      heading: Math.random() * 360,
    };
    setCurrentLocation(resetPt);
    setLocationHistory([]);
    setElapsedMs(0);
  }, [cfg.startLat, cfg.startLng, stopTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Compute total distance
  const totalDistanceM = locationHistory.reduce((acc, pt, i) => {
    if (i === 0) return 0;
    const prev = locationHistory[i - 1];
    const dLat = (pt.lat - prev.lat) * METERS_PER_DEG_LAT;
    const dLng = (pt.lng - prev.lng) * metersPerDegLng(prev.lat);
    return acc + Math.sqrt(dLat * dLat + dLng * dLng);
  }, 0);

  return {
    currentLocation,
    locationHistory,
    isTracking,
    elapsedMs,
    totalDistanceM,
    startTracking,
    stopTracking,
    resetHistory,
  };
}
