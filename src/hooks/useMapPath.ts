import { PathPoint } from '@/global.d';
import { useEffect, useState } from 'react';

export const useMapPath = (map: any | null, path: PathPoint[] | null) => {
  const [polyline, setPolyline] = useState<any | null>(null);

  useEffect(() => {
    if (!map.current || !path?.length) return;

    if (polyline) {
      map.current.removeLayer(polyline);
    }

    const newPolyline = L.polyline(
      path.map(point => [point.lat, point.lng]),
      { color: 'rgb(133, 232, 157)', weight: 5, opacity: 0.7 }
    ).addTo(map.current);

    map.current.fitBounds(newPolyline.getBounds());
    setPolyline(newPolyline);
  }, [map, path]);
};