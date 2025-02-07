import { useState, useEffect } from "react";

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
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        };

        const failure = (err: GeolocationPositionError) => {
            console.error(err.message);
            setLocation({
                latitude: 50.8376,
                longitude: 0.7749,
            });
        }

        navigator.geolocation.getCurrentPosition(success, failure);
    },[]);

    return { location };
}