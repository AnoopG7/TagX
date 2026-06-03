import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import type { SimulatedPoint } from "@/hooks/useDeviceSimulation";

export interface AIFeedItem {
  id: string;
  source: "insight" | "alert" | "notification";
  title: string;
  description: string;
  timestamp: Date;
  type: string;
  severity?: string;
  confidence?: number;
}

interface AIFeaturesOptions {
  deviceId: string;
  deviceName: string;
  locationHistory: SimulatedPoint[];
  isTracking: boolean;
}

export function useAIFeatures({ deviceId, deviceName, locationHistory, isTracking }: AIFeaturesOptions) {
  const [feed, setFeed] = useState<AIFeedItem[]>([]);
  const [generatedCount, setGeneratedCount] = useState(0);
  const lastTickRef = useRef(0);
  const prevTrackingRef = useRef(false);
  const generatedPredictionRef = useRef(false);

  const tick = Math.floor(locationHistory.length / 10);

  const addToFeed = useCallback((item: Omit<AIFeedItem, "id" | "timestamp">) => {
    setFeed((prev) => [
      { ...item, id: `${item.source}-${Date.now()}-${Math.random()}`, timestamp: new Date() },
      ...prev,
    ].slice(0, 20));
  }, []);

  const create = useCallback(async (endpoint: string, body: Record<string, unknown>) => {
    try {
      const res = await api.post(endpoint, body);
      setGeneratedCount((c) => c + 1);
      return res.data.data;
    } catch {
      return null;
    }
  }, []);

  // On start tracking → AI leave prediction
  useEffect(() => {
    if (isTracking && !prevTrackingRef.current && !generatedPredictionRef.current) {
      generatedPredictionRef.current = true;
      create("/ai/leave-prediction", { deviceName }).then((data) => {
        if (data?.insight) {
          addToFeed({ source: "insight", title: data.insight.title, description: data.insight.description, type: data.insight.type, confidence: data.insight.confidence });
          addToFeed({ source: "notification", title: "Don't forget!", description: `${deviceName} hasn't moved — check if you have it.`, type: "reminder" });
        }
      });
    }
    if (!isTracking) {
      prevTrackingRef.current = false;
    } else {
      prevTrackingRef.current = true;
    }
  }, [isTracking, deviceName, create, addToFeed]);

  // Every 10 ticks → AI location insight
  useEffect(() => {
    if (!isTracking || locationHistory.length < 2) return;
    const currentTick = Math.floor(locationHistory.length / 10);
    if (currentTick > lastTickRef.current) {
      lastTickRef.current = currentTick;
      const pt = locationHistory[locationHistory.length - 1];
      create("/ai/location-insight", { lat: pt.lat, lng: pt.lng }).then((data) => {
        if (data?.insight) {
          addToFeed({ source: "insight", title: data.insight.title, description: data.insight.description, type: data.insight.type, confidence: data.insight.confidence });
        }
      });
    }
  }, [tick, isTracking, locationHistory, create, addToFeed]);

  // On stop tracking → AI session summary
  useEffect(() => {
    if (prevTrackingRef.current && !isTracking && locationHistory.length > 1) {
      const last = locationHistory[locationHistory.length - 1];
      const totalPoints = locationHistory.length;
      let totalDist = 0;
      for (let i = 1; i < locationHistory.length; i++) {
        const a = locationHistory[i - 1];
        const b = locationHistory[i];
        totalDist += haversine(a.lat, a.lng, b.lat, b.lng);
      }
      const durationMs = locationHistory.length * 3000;
      create("/ai/session-summary", { totalPoints, distanceM: totalDist, durationMs, lat: last.lat, lng: last.lng }).then((data) => {
        if (data?.insight) {
          addToFeed({ source: "insight", title: data.insight.title, description: data.insight.description, type: data.insight.type, confidence: data.insight.confidence });
        }
      });
    }
  }, [isTracking, locationHistory, create, addToFeed]);

  const simulateLost = useCallback(async () => {
    const lastPt = locationHistory.length > 0
      ? locationHistory[locationHistory.length - 1]
      : null;

    try {
      const res = await api.post("/ai/report-lost", {
        deviceName,
        lat: lastPt?.lat,
        lng: lastPt?.lng,
        deviceId,
      });
      const data = res.data.data;
      setGeneratedCount((c) => c + 3);
      if (data?.alert) {
        addToFeed({ source: "alert", title: data.alert.title, description: data.alert.description, type: "critical", severity: "critical" });
      }
      if (data?.insight) {
        addToFeed({ source: "insight", title: data.insight.title, description: data.insight.description, type: data.insight.type, confidence: data.insight.confidence });
      }
      if (data?.notification) {
        addToFeed({ source: "notification", title: data.notification.title, description: data.notification.description, type: "security" });
      }
      toast.success("Lost device alert triggered");
    } catch {
      toast.error("Failed to trigger lost device alert");
    }
  }, [deviceId, deviceName, locationHistory, addToFeed]);

  return { feed, simulateLost, generatedCount };
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
