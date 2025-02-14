import { Location, BOUNDS } from "@/global.d";
import { useRef, useEffect } from "react";

export const useMapInstance = (initialLocation: Location | null) => {
    const mapRef = useRef<any | null>(null);

    useEffect(() => {
        if (!initialLocation) {
            return;
        }
    
        if (!mapRef.current) {
          mapRef.current = L.map("map", {
            maxBounds: L.latLngBounds(
              L.latLng(BOUNDS.minLat, BOUNDS.minLon),
              L.latLng(BOUNDS.maxLat, BOUNDS.maxLon) 
            ),
            maxBoundsViscosity: 1.0,
            minZoom: 14,
          }).setView([initialLocation.lat, initialLocation.lng], 17);
    
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
            bounds: L.latLngBounds(
              L.latLng(BOUNDS.minLat, BOUNDS.minLon),
              L.latLng(BOUNDS.maxLat, BOUNDS.maxLon)
            )
          }).addTo(mapRef.current);

          const center = mapRef.current.getCenter();
          if (!mapRef.current.getBounds().contains(center)) {
            mapRef.current.setView([
              (BOUNDS.maxLat + BOUNDS.minLat) / 2,
              (BOUNDS.maxLon + BOUNDS.minLon) / 2
            ]);
          }
        }
      }, [initialLocation]);

    return mapRef
} 