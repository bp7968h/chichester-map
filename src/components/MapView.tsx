import { useLocation } from "@/hooks/useLocation";
import { title } from "process";
import React, { useEffect, useState, useRef } from "react";

const MapView: React.FC<{
    start: { lat: number; lng: number } | null;
    end: { lat: number; lng: number } | null;
    setStart: (location: { lat: number; lng: number }) => void;
    setEnd: (location: { lat: number; lng: number }) => void;
}> = ({ start, end, setStart, setEnd }) => {
    const mapRef = useRef<any | null>(null);
    const [startMarker, setStartMarker] = useState<any | null>(null);
    const [endMarker, setEndMarker] = useState<any | null>(null);

    console.log("map render");

    useEffect(() => {
        if (!start) return;
    
        if (!mapRef.current) {
          mapRef.current = L.map("map").setView([start.lat, start.lng], 17);
    
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
          }).addTo(mapRef.current);
        }
      }, [location]);

    useEffect(() => {
        if (!mapRef.current || !start) return;

        if (!startMarker) {
          const marker = L.marker([start.lat, start.lng], { draggable: true, title: "Start" })
            .addTo(mapRef.current)
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
      }, [start]);

    useEffect(() => {
        if (!mapRef.current || !end) return;

        if (!endMarker) {
          const marker = L.marker([end.lat, end.lng], { draggable: true, title: "End" })
            .addTo(mapRef.current)
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
      }, [end]);

    useEffect(() => {
        if (!mapRef.current) return;

        mapRef.current.on("click", (e: any) => {
          if (!end) {
            setEnd({ lat: e.latlng.lat, lng: e.latlng.lng });
          }
        });

        return () => {
          mapRef.current?.off("click");
        };
    }, [end]);

    return (
        <div id="map" className="w-full h-full p-2 z-0">
        </div>
    );
}

export default MapView;