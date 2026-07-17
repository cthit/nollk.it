export interface Poi {
  id: number;
  name: string;
  lat: number;
  lng: number;
  score: number;
  geoFenceDistance: number;
  taskName: string;
  fullTask: string;
  nearestStop: string;
  transportMode: string;
  unlocked?: boolean;
}

export type TransitStopType = "tram" | "bus" | "both";

export interface TransitLineStop {
  name: string;
  lat: number;
  lng: number;
}

export interface TransitLine {
  id: string;
  name: string;
  color: string;
  stops: TransitLineStop[];
}

export interface TransitStop {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: TransitStopType;
  lines: string[];
}

export interface TransitNetworkStop {
  name: string;
  lat: number;
  lng: number;
  type: TransitStopType;
  lines: string[];
}

export interface TransitNetwork {
  lines: TransitLine[];
  stops: TransitNetworkStop[];
}

export interface UserLocation {
  lat: number;
  lng: number;
}
