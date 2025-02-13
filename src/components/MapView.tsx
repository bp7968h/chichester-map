import { Location, PathPoint, L } from "@/global";
import React, { useEffect, useState, useRef } from "react";

interface MapViewProps {
  start: Location | null;
  end: Location | null;
  setStart: (location: Location) => void;
  setEnd: (location: Location) => void;
  path: PathPoint[] | null;
}

const MapView: React.FC<MapViewProps> = ({ start, end, setStart, setEnd, path }) => {
    const mapRef = useRef<any | null>(null);
    const [startMarker, setStartMarker] = useState<any | null>(null);
    const [endMarker, setEndMarker] = useState<any | null>(null);
    const [pathPolyline, setPathPolyline] = useState<any | null>(null);

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
          const marker = L.marker([end.lat, end.lng], { draggable: true, title: "End", opacity: 0.8 })
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

    useEffect(() => {
      if (!mapRef.current || !path || path.length === 0) return;

      if (pathPolyline) {
          mapRef.current.removeLayer(pathPolyline);
      }

      const newPolyline = L.polyline(
          path.map(point => [point.lat, point.lng]), 
          { color: "rgb(133, 232, 157)", weight: 5, opacity: 0.7 }
      ).addTo(mapRef.current);

      mapRef.current.fitBounds(newPolyline.getBounds());

      setPathPolyline(newPolyline);
  }, [path]);

    return (
        <div id="map" className="w-full h-full p-2 z-0">
        </div>
    );
}

export default MapView;
