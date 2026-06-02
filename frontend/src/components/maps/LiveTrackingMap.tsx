import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { SimulatedPoint } from "@/hooks/useDeviceSimulation";

interface LiveTrackingMapProps {
  currentLocation: SimulatedPoint;
  /** Recent trail points to render (last N points) */
  trail: SimulatedPoint[];
  /** Whether to auto-pan map to follow the marker */
  followMarker?: boolean;
  className?: string;
}

// OpenStreetMap — standard light tiles
const TILE_URL =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function createPulsingIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:20px;height:20px;">
        <div style="
          position:absolute;inset:0;
          border-radius:50%;
          background:rgba(0,212,170,0.25);
          animation:tagx-pulse 2s ease-in-out infinite;
        "></div>
        <div style="
          position:absolute;top:4px;left:4px;width:12px;height:12px;
          border-radius:50%;
          background:#00D4AA;
          border:2px solid #fff;
          box-shadow:0 0 8px rgba(0,212,170,0.6);
        "></div>
      </div>
      <style>
        @keyframes tagx-pulse {
          0%,100% { transform:scale(1); opacity:1; }
          50% { transform:scale(2.2); opacity:0; }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

export function LiveTrackingMap({
  currentLocation,
  trail,
  followMarker = true,
  className,
}: LiveTrackingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const trailLineRef = useRef<L.Polyline | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView([currentLocation.lat, currentLocation.lng], 16);

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTR,
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control to bottom-right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Pulsing marker
    const marker = L.marker([currentLocation.lat, currentLocation.lng], {
      icon: createPulsingIcon(),
    }).addTo(map);

    // Trail polyline
    const trailLine = L.polyline([], {
      color: "#00D4AA",
      weight: 3,
      opacity: 0.5,
      dashArray: "6 4",
    }).addTo(map);

    mapRef.current = map;
    markerRef.current = marker;
    trailLineRef.current = trailLine;

    // Fix tile rendering on mount
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      trailLineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker + trail on location change
  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    const trailLine = trailLineRef.current;
    if (!map || !marker || !trailLine) return;

    const latlng = L.latLng(currentLocation.lat, currentLocation.lng);
    marker.setLatLng(latlng);

    // Update trail polyline
    const trailLatLngs = trail.map((pt) => L.latLng(pt.lat, pt.lng));
    trailLine.setLatLngs(trailLatLngs);

    if (followMarker) {
      map.panTo(latlng, { animate: true, duration: 0.8 });
    }
  }, [currentLocation, trail, followMarker]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-xl border border-border ${className ?? "h-full"}`}
      style={{ zIndex: 0, minHeight: 400 }}
    />
  );
}
