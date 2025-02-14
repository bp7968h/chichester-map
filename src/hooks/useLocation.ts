import { useState, useEffect } from "react";
import {BOUNDS} from "@/global.d";

type Coordinates = {
    latitude: number, 
    longitude: number
};

export function useLocation () {
    const [location, setLocation] = useState<(null | Coordinates )>(null);

    useEffect(()=> {
        if (!navigator.geolocation) {
            return;
        }

        const success = (position: GeolocationPosition) => {
            const {latitude, longitude } = position.coords;

            if (
                latitude >= BOUNDS.minLat && 
                latitude <= BOUNDS.maxLat && 
                longitude >= BOUNDS.minLon && 
                longitude <= BOUNDS.maxLon
            ) {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            } else {
                setLocation({
                    latitude: 50.8376,
                    longitude: 0.7749,
                });
            }
        };

        const failure = (err: GeolocationPositionError) => {
            console.error(err);
            setLocation({
                latitude: 50.8376,
                longitude: 0.7749,
            });
        }

        navigator.geolocation.getCurrentPosition(success, failure);
    },[]);

    return { location };
}