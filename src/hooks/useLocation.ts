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
            const {latitude, longitude } = position.coords;
            const maxlat = 50.84156;
            const maxlon = -0.75059;
            const minlat = 50.8254;
            const minlon = -0.79419;

            if (latitude >= minlat && latitude <= maxlat && longitude >= minlon && longitude <= maxlon) {
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