import React, { useMemo, useState } from "react";
import { pois, type Poi } from "./pois";
import { transitStops } from "./transit-stops";

const styles = `
  :root {
    color-scheme: dark;
    --bg: #07111f;
    --panel: rgba(10, 24, 41, 0.92);
    --text: #f8fafc;
    --muted: #94a3b8;
    --accent: #38bdf8;
    --accent-2: #f59e0b;
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;
    background: linear-gradient(135deg, #07111f, #10253e 55%, #0f172a);
    color: var(--text);
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #07111f, #10253e 55%, #0f172a);
  }

  .app-header {
    display: flex;
    justify-content: center;
    padding: 16px;
  }

  .brand {
    background: rgba(7, 17, 31, 0.72);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 999px;
    padding: 12px 16px;
    text-align: center;
  }

  .brand h1 {
    margin: 0;
    font-size: 1rem;
  }

  .brand p {
    margin: 4px 0 0;
    color: var(--muted);
    font-size: 0.8rem;
  }

  .map-shell {
    flex: 1;
    padding: 0 16px 16px;
    display: grid;
    gap: 12px;
  }

  .map-placeholder {
    min-height: 320px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(7, 17, 31, 0.82);
    display: grid;
    place-items: center;
    color: var(--muted);
    font-weight: 600;
  }

  .map-controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  button {
    border: none;
    border-radius: 999px;
    padding: 10px 14px;
    font-size: 0.95rem;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, var(--accent), #2563eb);
    cursor: pointer;
  }

  button.secondary {
    background: rgba(255,255,255,0.09);
    color: var(--text);
  }

  .poi-list {
    display: grid;
    gap: 10px;
    padding: 0 16px 24px;
  }

  .poi-card {
    text-align: left;
    padding: 14px;
    background: var(--panel);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .poi-card strong {
    display: block;
    margin-bottom: 4px;
  }

  .poi-card span {
    display: block;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(56, 189, 248, 0.16);
    color: #bae6fd;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .detail {
    margin-top: 8px;
    padding: 12px;
    border-radius: 14px;
    background: rgba(255,255,255,0.05);
    color: var(--muted);
  }
`;

export default function ScavengerHuntMap() {
  const [selectedPoiId, setSelectedPoiId] = useState<number | null>(null);
  const [adminMode, setAdminMode] = useState(false);

  const selectedPoi = useMemo<Poi | null>(() => {
    return pois.find((poi) => poi.id === selectedPoiId) ?? null;
  }, [selectedPoiId]);

  return (
    <div className={`app${adminMode ? " admin-mode" : ""}`}>
      <style>{styles}</style>

      <header className="app-header">
        <div className="brand" onClick={() => setAdminMode((value) => !value)}>
          <h1>Scavenger Hunt Map</h1>
          <p>Explore the city and complete your tasks</p>
        </div>
      </header>

      <section className="map-shell">
        <div className="map-placeholder">Interactive map placeholder</div>
        <div className="map-controls">
          <button type="button">Locate me</button>
          <button className="secondary" type="button">
            Transit guide
          </button>
          <button className="secondary" type="button">
            {transitStops.length > 0 ? "Stops loaded" : "No stops yet"}
          </button>
        </div>
      </section>

      <section className="poi-list" aria-label="Poi list">
        {pois.map((poi) => (
          <button
            key={poi.id}
            className="poi-card"
            type="button"
            onClick={() => setSelectedPoiId(poi.id)}
          >
            <span>
              <strong>{poi.name}</strong>
              <span>{poi.taskName}</span>
            </span>
            <span className="pill">{poi.score}</span>
          </button>
        ))}
      </section>

      {selectedPoi ? (
        <section className="poi-list">
          <div className="detail">
            <strong>{selectedPoi.name}</strong>
            <p>{selectedPoi.fullTask}</p>
            <p>Nearest stop: {selectedPoi.nearestStop}</p>
            <p>Transport mode: {selectedPoi.transportMode}</p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
