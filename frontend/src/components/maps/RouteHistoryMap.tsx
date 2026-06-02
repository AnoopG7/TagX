import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import type { SimulatedPoint } from "@/hooks/useDeviceSimulation";

interface RouteHistoryMapProps {
  /** Full location history to render as a route */
  history: SimulatedPoint[];
  className?: string;
}

// OpenStreetMap — standard light tiles
const TILE_URL =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const START_ICON = L.divIcon({
  className: "",
  html: `<div style="
    background:#00D4AA;color:#0A0E17;width:26px;height:26px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:11px;font-weight:800;border:2px solid #fff;
    box-shadow:0 2px 8px rgba(0,212,170,0.4);
  ">S</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const END_ICON = L.divIcon({
  className: "",
  html: `<div style="
    background:#FF5A5F;color:#fff;width:26px;height:26px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:11px;font-weight:800;border:2px solid #fff;
    box-shadow:0 2px 8px rgba(255,90,95,0.4);
  ">E</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function RouteHistoryMap({ history, className }: RouteHistoryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Persistent layer refs — updated incrementally, never destroyed
  const routeLineRef = useRef<L.Polyline | null>(null);
  const glowLineRef = useRef<L.Polyline | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);
  const prevLengthRef = useRef(0);

  // Initialize map once when we have ≥2 points
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (history.length < 2) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
    }).setView([history[0].lat, history[0].lng], 15);

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTR,
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Create persistent layers
    const glowLine = L.polyline([], {
      color: "#00D4AA",
      weight: 10,
      opacity: 0.12,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    const routeLine = L.polyline([], {
      color: "#00D4AA",
      weight: 4,
      opacity: 0.7,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    const startMarker = L.marker([history[0].lat, history[0].lng], {
      icon: START_ICON,
    })
      .addTo(map)
      .bindPopup(`<b>Start</b><br/>${formatTimestamp(history[0].timestamp)}`);

    const endMarker = L.marker([history[0].lat, history[0].lng], {
      icon: END_ICON,
    }).addTo(map);

    mapRef.current = map;
    routeLineRef.current = routeLine;
    glowLineRef.current = glowLine;
    startMarkerRef.current = startMarker;
    endMarkerRef.current = endMarker;
    prevLengthRef.current = 0; // force full update on first render

    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
      routeLineRef.current = null;
      glowLineRef.current = null;
      startMarkerRef.current = null;
      endMarkerRef.current = null;
      prevLengthRef.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.length >= 2]); // only re-run when crossing the 2-point threshold

  // Incrementally update the polyline and end marker when history grows
  useEffect(() => {
    const map = mapRef.current;
    const routeLine = routeLineRef.current;
    const glowLine = glowLineRef.current;
    const endMarker = endMarkerRef.current;
    if (!map || !routeLine || !glowLine || !endMarker) return;
    if (history.length < 2) return;

    const latlngs = history.map((pt) => L.latLng(pt.lat, pt.lng));

    // Update polylines (Leaflet handles this efficiently)
    routeLine.setLatLngs(latlngs);
    glowLine.setLatLngs(latlngs);

    // Move end marker to the latest point
    const lastPt = history[history.length - 1];
    const lastLatLng = L.latLng(lastPt.lat, lastPt.lng);
    endMarker.setLatLng(lastLatLng);
    endMarker.bindPopup(
      `<b>Current</b><br/>${formatTimestamp(lastPt.timestamp)}`
    );

    // Only fit bounds on significant changes (every 10 new points) to avoid jitter
    const prevLen = prevLengthRef.current;
    if (
      prevLen === 0 ||
      history.length - prevLen >= 10 ||
      history.length <= 3
    ) {
      map.fitBounds(L.latLngBounds(latlngs), {
        padding: [50, 50],
        animate: true,
        duration: 0.5,
      });
      prevLengthRef.current = history.length;
    }
  }, [history]);

  if (history.length < 2) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/30 ${className ?? "h-full"}`}
        style={{ minHeight: 400 }}
      >
        <MapPin className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Start tracking to record a route
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          At least 2 points needed to display the path
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-xl border border-border ${className ?? "h-full"}`}
      style={{ zIndex: 0, minHeight: 400 }}
    />
  );
}
