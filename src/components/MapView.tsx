import { Location, PathPoint } from "@/global.d";
import { useMapInstance } from "@/hooks/useMapInstance";
import { useMapMarker } from "@/hooks/useMapMarker";
import React, { useEffect, useState } from "react";

interface MapViewProps {
  start: Location | null;
  end: Location | null;
  setStart: (location: Location) => void;
  setEnd: (location: Location) => void;
  path: PathPoint[] | null;
}

const MapView: React.FC<MapViewProps> = ({ start, end, setStart, setEnd, path }) => {
    const mapRef = useMapInstance(start);
    const [pathPolyline, setPathPolyline] = useState<any | null>(null);

    useMapMarker({map: mapRef!, position: start!, title: 'Start', onDragEnd: setStart});
    useMapMarker({map: mapRef!, position: end!, title: 'End', opacity: 0.8, onDragEnd: setEnd});

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
