import { Location } from "@/global.d";
import { useRef, useEffect } from "react";


export const useMapInstance = (initialLocation: Location | null) => {
    const mapRef = useRef<any | null>(null);

    useEffect(() => {
        if (!initialLocation) {
            return;
        }
    
        if (!mapRef.current) {
          mapRef.current = L.map("map").setView([initialLocation.lat, initialLocation.lng], 17);
    
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
          }).addTo(mapRef.current);
        }
      }, [initialLocation]);

    return mapRef
} 