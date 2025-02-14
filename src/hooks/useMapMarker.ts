import { Location } from '@/global.d';
import { useEffect, useState } from 'react';

interface MarkerOptions {
    map: any;
    position: Location;
    title: string;
    opacity?: number;
    onDragEnd: (location: Location) => void;
}

export const useMapMarker = ({
    map,
    position,
    title,
    opacity = 1,
    onDragEnd,
  }: MarkerOptions) => {
    const [marker, setMarker] = useState<any | null>(null);

    useEffect(() => {
        if (!map || !position) return;
    
        if (!marker) {
          const newMarker = L.marker([position.lat, position.lng], {
            draggable: true,
            title,
            opacity,
          })
            .addTo(map.current)
            .bindPopup(`${title} Point`)
            .openPopup();
    
          newMarker.on('dragend', (e: any) => {
            const newPos = e.target.getLatLng();
            onDragEnd({ lat: newPos.lat, lng: newPos.lng });
          });
    
          setMarker(newMarker);
        } else {
          marker.setLatLng([position.lat, position.lng]);
        }

        return () => {
          if (marker) {
            marker.remove();
          }
        };

      }, [map, position, title, opacity, onDragEnd]);
    
    return marker;
}
