declare const L: any;

export interface Location {
    lat: number,
    lng: number,
}

export interface PathPoint extends Location {
    id: number,
}