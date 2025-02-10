import { useLocation } from "@/hooks/useLocation";
import React, { useEffect, useState } from "react";

const MapView: React.FC = () => {
    const {location} = useLocation();
    const [map, setMap] = useState<any | null>(null);

    useEffect(() => {
        if (!location) return;

        if (!map) {
            const newMap = L.map("map").setView([location.latitude, location.longitude], 20);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
            }).addTo(newMap);

            L.marker([location.latitude, location.longitude]).addTo(newMap);
            setMap(newMap);
        } else {
            map.setView([location.latitude, location.longitude], 20);
            L.marker([location.latitude, location.longitude]).addTo(map);

            map.on('click', function(e: any) {
                // console.log(e);
                alert(e.latlng);
            });
        }

        return () => {
            map?.remove();
        };
    },[location, map])

    return (
        <div id="map" className="w-full h-full p-2 z-0">
        </div>
    )
}

export default MapView;