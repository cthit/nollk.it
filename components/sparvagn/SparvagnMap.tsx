import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "../../styles/SparvagnMap.module.css";
import { transitNetwork, transitStops as initialTransitStops } from "../../lib/sparvagn/transit";
import type { TransitStop, UserLocation } from "../../lib/sparvagn/types";
import type { Poi } from "@prisma/client";






interface SparvagnMapProps {
  poi: Poi[];
}



type LeafletModule = typeof import("leaflet");
type LeafletMap = import("leaflet").Map;
type LeafletMarker = import("leaflet").Marker;
type LeafletLayerGroup = import("leaflet").LayerGroup;
type LeafletCircleMarker = import("leaflet").CircleMarker;

const ADMIN_PASSWORD = process.env.SPARVAGN_PASSWORD;

function interpolateColor(start: number[], end: number[], factor: number) {
  const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
  return `rgb(${mix(start[0], end[0], factor)}, ${mix(start[1], end[1], factor)}, ${mix(start[2], end[2], factor)})`;
}

function scoreToColor(score: number, pois: Poi[]) {
  if (!pois.length) {
    return "#f59e0b";
  }
  const minScore = Math.min(...pois.map((poi) => poi.score));
  const maxScore = Math.max(...pois.map((poi) => poi.score));
  const range = maxScore - minScore || 1;
  const factor = Math.min(1, Math.max(0, (score - minScore) / range));
  return interpolateColor([250, 204, 21], [139, 92, 246], factor);
}

function distanceToPoi(pos: UserLocation, poi: Poi) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const radius = 6371000;
  const dLat = toRad(poi.lat - pos.lat);
  const dLng = toRad(poi.lng - pos.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pos.lat)) * Math.cos(toRad(poi.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radius * c;
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && text[i + 1] === "\n") {
        i += 1;
      }
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value.length || row.length) {
    row.push(value);
    rows.push(row);
  }

  if (!rows.length) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());
  return rows
    .slice(1)
    .filter((entry) => entry.some((cell) => cell.trim()))
    .map((entry) => Object.fromEntries(headers.map((header, index) => [header, entry[index] ?? ""])));
}

function normalizePoi(raw: Record<string, unknown>, index: number): Poi {
  const score = Number(raw.score ?? raw.points ?? 0);
  const geoFenceDistance = Number(raw.geoFenceDistance ?? raw.radius ?? raw.range ?? 80);
  return {
    id: String(raw.id ?? index + 1),
    name: String(raw.name ?? raw.title ?? `POI ${index + 1}`),
    lat: Number(raw.lat ?? raw.latitude),
    lng: Number(raw.lng ?? raw.longitude ?? raw.lon ?? raw.long),
    score: Number.isFinite(score) ? score : 0,
    geoFenceDistance: Number.isFinite(geoFenceDistance) ? geoFenceDistance : 80,
    taskName: String(raw.taskName ?? raw.task ?? raw.hint ?? "Hidden challenge"),
    fullTask: String(raw.fullTask ?? raw.description ?? raw.challenge ?? "Complete the task at this location."),
    nearestStop: String(raw.nearestStop ?? raw.closestStop ?? raw.stop ?? raw.tramStop ?? raw.busStop ?? ""),
    transportMode: String(raw.transportMode ?? raw.mode ?? raw.transitMode ?? "tram/bus"),
    unlocked: Boolean(raw.unlocked)
  };

}

function parsePoiPayload(payload: unknown): Poi[] {
  if (Array.isArray(payload)) {
    return payload.map((item, index) => normalizePoi(item as Record<string, unknown>, index));
  }

  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;

    if (Array.isArray(obj.rows)) {
      return obj.rows.map((item, index) => normalizePoi(item as Record<string, unknown>, index));
    }

    if (Array.isArray(obj.pois)) {
      return obj.pois.map((item, index) => normalizePoi(item as Record<string, unknown>, index));
    }

    if (Array.isArray(obj.values)) {
      const values = obj.values as unknown[][];
      const headers = (values[0] ?? []) as string[];
      return values
        .slice(1)
        .filter((entry) => entry.some((cell) => String(cell).trim()))
        .map((entry, index) =>
          normalizePoi(
            Object.fromEntries(headers.map((header, headerIndex) => [header, entry[headerIndex] ?? ""])),
            index
          )
        );
    }
  }

  return [];
}

function buildPopupContent(poi: Poi, isUnlocked: boolean) {
  const stopHint = poi.nearestStop
    ? `<div class="sparvagn-popup-meta">Closest stop: ${poi.nearestStop} (${poi.transportMode})</div>`
    : "";


  return `
    <div class="sparvagn-popup-card">
      <div class="sparvagn-popup-title">${poi.name}</div>
      <div class="sparvagn-popup-score">${poi.score} pts</div>
      <div><strong>${isUnlocked ? "Challenge" : "Hint"}</strong></div>
      <div>${isUnlocked ? poi.fullTask : poi.taskName}</div>
      <div class="sparvagn-popup-meta">Unlock radius: ${poi.geoFenceDistance} m</div>
      ${stopHint}
    </div>
  `;
}

export default function SparvagnMap({ poi }: SparvagnMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const poiMarkersRef = useRef<LeafletMarker[]>([]);
  const stopMarkersRef = useRef<LeafletMarker[]>([]);
  const transitLayerRef = useRef<LeafletLayerGroup | null>(null);
  const userMarkerRef = useRef<LeafletCircleMarker | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const locationPollTimerRef = useRef<number | null>(null);
  const locationAnimationFrameRef = useRef<number | null>(null);
  const refreshTimerRef = useRef<number | null>(null);
  const hasCenteredOnLocationRef = useRef(false);

  const [pois, setPois] = useState<Poi[]>(() => poi.map((p) => ({ ...p, unlocked: false })));
  // console.log("Rendering SparvagnMap with pois:", pois);
  const [transitStops] = useState<TransitStop[]>(initialTransitStops);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [hasCenteredOnLocation, setHasCenteredOnLocation] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [status, setStatus] = useState("Enter the organizer password to unlock POI import tools.");
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);

  const lineLegend = useMemo(
    () => transitNetwork.lines.map((line) => `${line.name} - ${line.color}`),
    []
  );

  const stopLocationAnimation = useCallback(() => {
    if (locationAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(locationAnimationFrameRef.current);
      locationAnimationFrameRef.current = null;
    }
  }, []);

  const renderUserLocation = useCallback((location: UserLocation) => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) {
      return;
    }

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([location.lat, location.lng]);
      return;
    }

    userMarkerRef.current = L.circleMarker([location.lat, location.lng], {
      radius: 8,
      color: "#38bdf8",
      fillColor: "#38bdf8",
      fillOpacity: 0.95,
      weight: 3
    }).addTo(map);
  }, []);

  useEffect(() => {
    temporalFetchPois();
  }, []);

  const temporalFetchPois = () => {
    const fetchPois = async () => {
      try {
        const response = await fetch("/api/sparvagn/poi/get");
        if (!response.ok) {
          throw new Error(`Failed to fetch POIs: ${response.statusText}`);
        }
        const data: Poi[] = await response.json();
        console.log("Fetching POIs temporally")
        // update the POIs state with the new POIs in prisma
        // compare names to see if they are different, if so update the state
        if (JSON.stringify(data.map(poi => poi.name)) !== JSON.stringify(pois.map(poi => poi.name))) {
          setPois(data);
          console.log("Updated POIs with new data from the server");
        }
        return data;
      } catch (error) {
        console.error("Error fetching POIs:", error);
        return [];
      }
    };
    setInterval(fetchPois, 60000); // Fetch every 60 seconds
  }




  const buildMarkerIcon = useCallback(
    (L: LeafletModule, poi: Poi) => {
      const color = poi.unlocked ? "#22c55e" : scoreToColor(poi.score, pois);
      return L.divIcon({
        html: `<div style="background:${color}; color:white; width:42px; height:42px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; border:3px solid white; box-shadow:0 8px 20px rgba(0,0,0,0.28);">${poi.score}</div>`,
        className: "",
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });
    },

    [pois]
  );

  const updatePoiMarkers = useCallback(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) {
      return;
    }

    poiMarkersRef.current.forEach((marker) => map.removeLayer(marker));
    poiMarkersRef.current = pois.map((poi) => {
      const marker = L.marker([poi.lat, poi.lng], { icon: buildMarkerIcon(L, poi) }).addTo(map);
      marker.bindPopup(buildPopupContent(poi, Boolean(poi.unlocked)));
      marker.on("click", () => {
        marker.setPopupContent(buildPopupContent(poi, Boolean(poi.unlocked)));
        marker.openPopup();
        map.panTo([poi.lat, poi.lng], { animate: true, duration: 0.7 });
      });
      return marker;
    });
  }, [buildMarkerIcon, pois]);

  const updateStopMarkers = useCallback(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) {
      return;
    }

    stopMarkersRef.current.forEach((marker) => map.removeLayer(marker));
    stopMarkersRef.current = transitStops.map((stop) => {
      const color = stop.type === "bus" ? "#60a5fa" : stop.type === "both" ? "#a78bfa" : "#94a3b8";
      const icon = L.divIcon({
        html: `<div style="background:${color}; width:7px; height:7px; border-radius:999px; border:1px solid rgba(255,255,255,0.8); box-shadow:0 0 0 1px rgba(15,23,42,0.15); opacity:0.9;"></div>`,
        className: "",
        iconSize: [7, 7],
        iconAnchor: [3.5, 3.5]
      });
      const marker = L.marker([stop.lat, stop.lng], { icon }).addTo(map);
      const typeLabel = stop.type === "both" ? "Tram and bus" : stop.type === "bus" ? "Bus stop" : "Tram stop";
      marker.bindPopup(`
        <div class="sparvagn-popup-card">
          <div class="sparvagn-popup-title">${stop.name}</div>
          <div class="sparvagn-popup-meta">${stop.lines.join(", ")}</div>
          <div class="sparvagn-popup-meta">${typeLabel}</div>
        </div>
      `);
      return marker;
    });
  }, [transitStops]);

  const checkGeoFence = useCallback(() => {
    if (!userLocation) {
      return;
    }

    setPois((prev) => {
      let changed = false;
      const next = prev.map((poi) => {
        const isInsideFence = distanceToPoi(userLocation, poi) <= poi.geoFenceDistance;
        if (poi.unlocked !== isInsideFence) {
          changed = true;
          return { ...poi, unlocked: isInsideFence };
        }
        return poi;
      });
      if (!changed) {
        return prev;
      }
      return next;
    });
  }, [userLocation]);

  const onLocationSuccess = useCallback(
    (position: GeolocationPosition) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      setUserLocation(location);

      const map = mapRef.current;
      const L = leafletRef.current;
      if (!map || !L) {
        return;
      }

      if (!hasCenteredOnLocationRef.current) {
        map.setView([location.lat, location.lng], 16);
        hasCenteredOnLocationRef.current = true;
        setHasCenteredOnLocation(true);
      }
      if (userMarkerRef.current) {
        stopLocationAnimation();

        const start = userMarkerRef.current.getLatLng();
        const startTime = performance.now();
        const duration = 900;

        const step = (now: number) => {
          const progress = Math.min(1, (now - startTime) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const lat = start.lat + (location.lat - start.lat) * eased;
          const lng = start.lng + (location.lng - start.lng) * eased;
          userMarkerRef.current?.setLatLng([lat, lng]);

          if (progress < 1) {
            locationAnimationFrameRef.current = window.requestAnimationFrame(step);
          } else {
            locationAnimationFrameRef.current = null;
          }
        };

        locationAnimationFrameRef.current = window.requestAnimationFrame(step);
      } else {
        renderUserLocation(location);
      }
    },
    [renderUserLocation, stopLocationAnimation]
  );

  const onLocationError = useCallback(() => {
    setStatus("Location access was blocked, so the POIs stay locked until you enable it.");
  }, []);

  const startLocationTracking = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      onLocationError();
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (locationPollTimerRef.current !== null) {
      window.clearInterval(locationPollTimerRef.current);
      locationPollTimerRef.current = null;
    }

    navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000
    });

    watchIdRef.current = navigator.geolocation.watchPosition(onLocationSuccess, onLocationError, {
      enableHighAccuracy: true,
      maximumAge: 2500,
      timeout: 15000
    });

    locationPollTimerRef.current = window.setInterval(() => {
      navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    }, 3000);
  }, [onLocationError, onLocationSuccess]);

  const centerOnUserLocation = useCallback(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView([userLocation.lat, userLocation.lng], 16);
      return;
    }

    startLocationTracking();
  }, [startLocationTracking, userLocation]);

  const loadPoisFromFile = useCallback(async (file: File) => {
    const text = await file.text();
    try {
      const payload = JSON.parse(text);
      const parsed = parsePoiPayload(payload);
      if (!parsed.length) {
        throw new Error("No POIs were found in the imported data.");
      }
      setPois(parsed);
      setStatus(`Loaded ${parsed.length} POIs from the uploaded file.`);
    } catch {
      const parsed = parsePoiPayload(parseCsv(text));
      if (!parsed.length) {
        setStatus("No POIs were found in the imported data.");
        return;
      }
      setPois(parsed);
      setStatus(`Loaded ${parsed.length} POIs from the uploaded CSV.`);
    }

    const newPois = parsePoiPayload(parseCsv(text));
    // update the POIs state with the new POIs in prisma
    fetch("/api/sparvagn/poi/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPois)
    }).then((res) => {
      if (res.ok) {
        setStatus(`Successfully updated ${newPois.length} POIs in the database.`);
      } else {
        setStatus("Failed to update POIs in the database.");
      }
    });

  }, []);

  useEffect(() => {
    checkGeoFence();
  }, [checkGeoFence]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!mapContainerRef.current || mapRef.current) {
        return;
      }

      const L = await import("leaflet");
      if (!mounted || !mapContainerRef.current) {
        return;
      }

      leafletRef.current = L;

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true
      }).setView([57.6887, 11.9804], 15);

      const baseLayers = {
        "Transit-friendly": L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors &copy; CARTO"
        }),
        Standard: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors"
        })
      };

      baseLayers["Transit-friendly"].addTo(map);

      const transitLayer = L.layerGroup();
      transitNetwork.lines.forEach((line) => {
        const path = line.stops.map((stop) => [stop.lat, stop.lng]) as [number, number][];
        if (path.length > 1) {
          L.polyline(path, {
            color: line.color,
            weight: 4,
            opacity: 0.85,
            lineCap: "round",
            lineJoin: "round"
          })
            .bindTooltip(line.name)
            .addTo(transitLayer);
        }
      });

      transitLayer.addTo(map);
      transitLayerRef.current = transitLayer;

      L.control.layers(baseLayers, { "Transit lines": transitLayer }).addTo(map);

      const markerLayer = L.layerGroup();

      transitStops.forEach((stop) => {
        const color = stop.type === "bus" ? "#60a5fa" : stop.type === "both" ? "#a78bfa" : "#94a3b8";
        const icon = L.divIcon({
          html: `<div style="background:${color}; width:7px; height:7px; border-radius:999px; border:1px solid rgba(255,255,255,0.8); box-shadow:0 0 0 1px rgba(15,23,42,0.15); opacity:0.9;"></div>`,
          className: "",
          iconSize: [7, 7],
          iconAnchor: [3.5, 3.5]
        });
        const marker = L.marker([stop.lat, stop.lng], { icon }).addTo(markerLayer);
        const typeLabel = stop.type === "both" ? "Tram and bus" : stop.type === "bus" ? "Bus stop" : "Tram stop";
        marker.bindPopup(`
          <div class="sparvagn-popup-card">
            <div class="sparvagn-popup-title">${stop.name}</div>
            <div class="sparvagn-popup-meta">${stop.lines.join(", ")}</div>
            <div class="sparvagn-popup-meta">${typeLabel}</div>
          </div>
        `);
      });

      markerLayer.addTo(map);



      updatePoiMarkers();
      updateStopMarkers();

      poiMarkersRef.current.forEach((marker) => map.removeLayer(marker));
      poiMarkersRef.current = pois.map((poi) => {
        const marker = L.marker([poi.lat, poi.lng], { icon: buildMarkerIcon(L, poi) }).addTo(map);
        marker.bindPopup(buildPopupContent(poi, Boolean(poi.unlocked)));
        marker.on("click", () => {
          marker.setPopupContent(buildPopupContent(poi, Boolean(poi.unlocked)));
          marker.openPopup();
          map.panTo([poi.lat, poi.lng], { animate: true, duration: 0.7 });
        });
        return marker;
      });

      poiMarkersRef.current.forEach((marker) => marker.addTo(map));


      mapRef.current = map;
    };

    init();

    return () => {
      mounted = false;

      if (watchIdRef.current !== null && typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      if (locationPollTimerRef.current !== null) {
        window.clearInterval(locationPollTimerRef.current);
        locationPollTimerRef.current = null;
      }

      stopLocationAnimation();

      if (refreshTimerRef.current !== null) {
        window.clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };

  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    updatePoiMarkers();

    // if (pois.length > 0) {
    //   mapRef.current.fitBounds(pois.map((poi) => [poi.lat, poi.lng] as [number, number]), { padding: [30, 30] });
    // }
  }, [pois, updatePoiMarkers]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    updateStopMarkers();
  }, [updateStopMarkers]);

  useEffect(() => {
    if (refreshTimerRef.current !== null) {
      window.clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (autoRefreshEnabled) {
      refreshTimerRef.current = window.setInterval(() => {
        setStatus("Auto-refresh is enabled. Upload a file again to refresh POIs.");
      }, 30000);
    }
  }, [autoRefreshEnabled]);

  return (
    <main className={`${styles.app} ${adminOpen ? styles.adminMode : ""}`}>
      <header className={styles.appHeader}>
        <div className={styles.brand} onClick={() => setRulesOpen((prev) => !prev)} role="button" tabIndex={0}>
          <h1>Spårvagnssafari</h1>
          <p>Tryck på en markör för att se utmaningen...</p>
        </div>
        <button type="button" className={styles.adminToggle} aria-label="Open admin tools" onClick={() => setAdminOpen(true)}>
          ⚙
        </button>
      </header>

      <section className={styles.mapShell}>
        <div ref={mapContainerRef} className={styles.map} aria-label="Interactive scavenger hunt map" />

        <div className={`${styles.rulesCard} ${rulesOpen ? styles.active : ""}`} role="dialog" aria-live="polite">
          <h2>Hur det fungerar</h2>
          <p>
            Spårvagnssafari går ut på att ni ska samla så många poäng som möjligt genom att åka till och lösa utmaningar runt om i
            Göteborg.
          </p>
          <h2>VIKTIGT!</h2>
          <p>Ni har en begränsad tid att åka till alla olika platser. Välj noga vilka utmaningar ni vill göra.</p>
          <p>Man hinner inte med alla.</p>
          <h3>Lunch tider hos Hubbau:</h3>
          <ul>
            <li>11:30-12:00 Grupp 1</li>
            <li>12:30-13:00 Grupp 2</li>
            <li>13:30-14:00 Grupp 3</li>
          </ul>
          <h2>Ni ska vara tillbaka på Chalmerplatsen innan 15:01</h2>
        </div>

        <button type="button" className={styles.transitToggle} onClick={() => setLegendOpen((prev) => !prev)}>
          {legendOpen ? "Stäng Guiden" : "Linje Guide"}
        </button>

        <div className={`${styles.transitLegend} ${legendOpen ? styles.active : ""}`} aria-label="Transit legend">
          <div className={styles.transitLegendTitle}>Linje Guide</div>
          {transitNetwork.lines.map((line, index) => (
            <div key={line.id} className={styles.transitLegendItem}>
              <span className={styles.transitDot} style={{ background: line.color }} />
              {lineLegend[index]}
            </div>
          ))}
        </div>

        <div className={styles.mapControls}>
          <button type="button" onClick={centerOnUserLocation}>
            {userLocation ? "Centrera" : "Dela Platsinformation"}
          </button>
        </div>
      </section>

      <section className={styles.adminPanel} aria-label="Admin tools">
        <div className={styles.adminPanelCard}>
          <div className={styles.adminPanelHeader}>
            <h2>Admin tools</h2>
            <button type="button" className={styles.secondary} onClick={() => setAdminOpen(false)}>
              Close
            </button>
          </div>

          <div className={styles.sheetImport}>
            <label htmlFor="adminPasswordInput">Organizer password</label>
            <input
              id="adminPasswordInput"
              type="password"
              placeholder="Enter password"
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  const unlocked = adminPassword.trim() === ADMIN_PASSWORD;
                  // setAdminUnlocked(unlocked);
                  fetch("/api/sparvagn/login", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ password: adminPassword.trim() })
                  }).then((res) => {
                    if (res.ok) {
                      setAdminUnlocked(true);
                      setStatus("Admin tools unlocked. You can manage POIs now.");
                    } else {
                      setStatus("Incorrect password.");
                    }
                  });
                }
              }}
            />

            <div className={styles.mapControlsStatic}>
              <button
                type="button"
                onClick={() => {
                  const unlocked = adminPassword.trim() === ADMIN_PASSWORD;
                  fetch("/api/sparvagn/login", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ password: adminPassword.trim() })
                  }).then((res) => {
                    if (res.ok) {
                      setAdminUnlocked(true);
                      setStatus("Admin tools unlocked. You can manage POIs now.");
                    } else {
                      setStatus("Incorrect password.");
                    }
                  });
                }}
              >
                Unlock
              </button>
            </div>

            {adminUnlocked ? (
              <div className={styles.adminTools}>
                <label htmlFor="poiFileInput">Upload a CSV or JSON file</label>
                <input
                  id="poiFileInput"
                  type="file"
                  accept=".csv,.json,text/csv,application/json"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      return;
                    }
                    await loadPoisFromFile(file);
                  }}
                />
                <div className={styles.mapControlsStatic}>
                  <button type="button" className={styles.secondary} onClick={() => setAutoRefreshEnabled((prev) => !prev)}>
                    {autoRefreshEnabled ? "Auto-refresh on" : "Auto-refresh every 30s"}
                  </button>
                </div>
              </div>
            ) : null}

            <p className={styles.sheetStatus}>{status}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
