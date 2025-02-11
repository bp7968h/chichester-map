import { useLocation } from "@/hooks/useLocation";
import React, { useEffect, useState } from "react";

const MapView: React.FC<{
    start: { lat: number; lng: number } | null;
    end: { lat: number; lng: number } | null;
    setStart: (location: { lat: number; lng: number }) => void;
    setEnd: (location: { lat: number; lng: number }) => void;
}> = ({ start, end, setStart, setEnd }) => {
    const {location} = useLocation();
    const [map, setMap] = useState<any | null>(null);
    const [startMarker, setStartMarker] = useState<any | null>(null);
    const [endMarker, setEndMarker] = useState<any | null>(null);

    useEffect(() => {
        if (!location) return;
    
        if (!map) {
          // Initialize Leaflet Map
          const newMap = L.map("map").setView([location.latitude, location.longitude], 13);
    
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
          }).addTo(newMap);
    
          setMap(newMap);
        }
      }, [location, map]);
    
      useEffect(() => {
        if (!map || !start) return;
    
        if (!startMarker) {
          // Create Start Marker (Draggable)
          const marker = L.marker([start.lat, start.lng], { draggable: true })
            .addTo(map)
            .bindPopup("Start Point")
            .openPopup();
    
          marker.on("dragend", (e: any) => {
            const newPos = e.target.getLatLng();
            setStart({ lat: newPos.lat, lng: newPos.lng });
          });
    
          setStartMarker(marker);
        } else {
          startMarker.setLatLng([start.lat, start.lng]);
        }
      }, [map, start]);
    
      useEffect(() => {
        if (!map || !end) return;
    
        if (!endMarker) {
          // Create End Marker (Draggable)
          const marker = L.marker([end.lat, end.lng], { draggable: true })
            .addTo(map)
            .bindPopup("End Point")
            .openPopup();
    
          marker.on("dragend", (e: any) => {
            const newPos = e.target.getLatLng();
            setEnd({ lat: newPos.lat, lng: newPos.lng });
          });
    
          setEndMarker(marker);
        } else {
          endMarker.setLatLng([end.lat, end.lng]);
        }
      }, [map, end]);
    
      useEffect(() => {
        if (!map) return;
    
        // Add click event to set end marker
        map.on("click", (e: any) => {
          if (!end) {
            setEnd({ lat: e.latlng.lat, lng: e.latlng.lng });
          }
        });
    
        return () => {
          map.off("click");
        };
      }, [map, end]);

    return (
        <div id="map" className="w-full h-full p-2 z-0">
        </div>
    )
}

export default MapView;