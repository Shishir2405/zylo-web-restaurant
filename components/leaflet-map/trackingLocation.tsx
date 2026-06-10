"use client";

import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";

// Fix leaflet's default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});

/**
 * Tracking map for the order detail page.
 *
 * Previously used leaflet-routing-machine to fetch a road route, but its
 * internal XMLHttpRequest could resolve AFTER the component unmounted —
 * the callback then called map.removeLayer(null) and crashed the page.
 *
 * For this surface a road route isn't worth the complexity: we just need
 * to show pickup ↔ drop visually. Render a static <Polyline> between the
 * two points and auto-fit the bounds. No async, no race, no crash.
 */
export default function TrackingLeafletMap({
  startLoc,
  endLoc,
}: {
  startLoc?: [number, number];
  endLoc?: [number, number];
}) {
  // Sensible defaults — restaurant and customer both around the same city
  // instead of the previous Virginia → New York fallback.
  const start: [number, number] = startLoc ?? [19.076, 72.8777];
  const end: [number, number] = endLoc ?? [19.0896, 72.8656];

  const center: [number, number] = useMemo(
    () => [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2],
    [start, end],
  );

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "100%", width: "100%", minHeight: 220, borderRadius: 10 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={start} />
      <Marker position={end} />
      <Polyline
        positions={[start, end]}
        pathOptions={{ color: "#f8b133", weight: 4, opacity: 0.85 }}
      />

      <FitBounds points={[start, end]} />
    </MapContainer>
  );
}

/** Fit the map to the two endpoints once they're known. */
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!map || points.length === 0) return;
    try {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    } catch {
      /* swallow — map may have been destroyed */
    }
  }, [map, points]);
  return null;
}
