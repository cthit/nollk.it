import type { Poi } from "./types";

export const pois: Poi[] = [
  {
    id: 1,
    name: "Harbor View",
    lat: 57.68824,
    lng: 11.97945,
    score: 30,
    geoFenceDistance: 70,
    taskName: "Find the blue bench",
    fullTask: "Take a photo of the blue bench with the water in the background.",
    nearestStop: "Central tram stop",
    transportMode: "tram"
  },
  {
    id: 2,
    name: "Campus Corner",
    lat: 57.6892,
    lng: 11.9784,
    score: 85,
    geoFenceDistance: 120,
    taskName: "Spot the tram sign",
    fullTask: "Locate the old tram sign and describe what color it is.",
    nearestStop: "Campus bus stop",
    transportMode: "bus"
  },
  {
    id: 3,
    name: "Garden Gate",
    lat: 57.6871,
    lng: 11.9809,
    score: 250,
    geoFenceDistance: 95,
    taskName: "Collect a nature clue",
    fullTask: "Find a leaf with a shape that reminds you of a heart.",
    nearestStop: "Garden tram stop",
    transportMode: "tram"
  },
  {
    id: 4,
    name: "Waterfront Steps",
    lat: 57.6897,
    lng: 11.9819,
    score: 1000,
    geoFenceDistance: 150,
    taskName: "Solve the riddle",
    fullTask: "Answer this riddle: what has keys but cannot open locks?",
    nearestStop: "Waterfront bus stop",
    transportMode: "bus"
  }
];
