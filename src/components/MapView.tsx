import React, { useEffect } from "react";

const MapView: React.FC = () => {

    useEffect(() => {
        if (typeof L === "undefined") {
            console.error("Leaflet is not loaded.");
            return;
        }

        const map = L.map("map").setView([51.505, -0.09], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
          }).addTo(map);

        L.marker([51.505, -0.09]).addTo(map).bindPopup("A sample marker").openPopup();

        return () => {
            map.remove();
        };
    },[])

    return (
        <div id="map" className="w-full h-full p-2 z-0">
        </div>
    )
}

export default MapView;