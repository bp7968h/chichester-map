declare const L: any;

export interface Location {
    lat: number,
    lng: number,
}

export interface PathPoint extends Location {
    id: number,
}

export const BOUNDS = {
    maxLat: 50.84156,
    minLat: 50.8254,
    maxLon: -0.75059,
    minLon: -0.79419
};