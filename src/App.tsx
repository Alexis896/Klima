import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import stationData from './data/klima_stations.json';
import type { StationDataset } from './types';
import { buildTemperatureOverlay } from './lib/overlay';
import Legend from './components/Legend';
import AboutPanel from './components/AboutPanel';

const data = stationData as StationDataset;

const FRANCE_CENTER: [number, number] = [46.6, 2.5];
const DEFAULT_ZOOM = 6;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    }) + ' UTC'
  );
}

function App() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [showAbout, setShowAbout] = useState(false);

  // Computed once, on first render, from the (static) station data — never
  // recomputed on pan/zoom. That's deliberate: the underlying temperature
  // readings don't change as you move the map, so there's nothing to
  // recalculate.
  const overlay = useMemo(() => {
    const points = data.stations.map((station) => ({
      lat: station.lat,
      lon: station.lon,
      value: station.readings.temperature_c,
    }));
    return buildTemperatureOverlay(points);
  }, []);

  const overlayBounds: [[number, number], [number, number]] = [
    [overlay.bounds.latMin, overlay.bounds.lonMin],
    [overlay.bounds.latMax, overlay.bounds.lonMax],
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Klima</h1>
        <p className="subtitle">
          {data.station_count} weather stations · {data.region} · snapshot from{' '}
          {formatDate(data.snapshot_date)}
        </p>
      </header>

      <div className="map-wrapper">
        <MapContainer
          center={FRANCE_CENTER}
          zoom={DEFAULT_ZOOM}
          className="map"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />
          {showOverlay && (
            <ImageOverlay url={overlay.imageUrl} bounds={overlayBounds} />
          )}
          {data.stations.map((station) => (
          <CircleMarker
            key={station.id}
            center={[station.lat, station.lon]}
            radius={7}
            pathOptions={{
              color: '#1b4965',
              fillColor: '#5fa8d3',
              fillOpacity: 0.85,
              weight: 1.5,
            }}
          >
            <Popup>
              <strong>{station.name}</strong>
              <br />
              {station.readings.temperature_c}°C
              {station.elevation_m !== null && <> · {station.elevation_m}m elevation</>}
              <br />
              {station.readings.humidity_pct !== undefined && (
                <>Humidity: {station.readings.humidity_pct}% </>
              )}
              {station.readings.wind_speed_ms !== undefined && (
                <>· Wind: {station.readings.wind_speed_ms} m/s</>
              )}
              <br />
              <span className="popup-meta">
                Station {station.id} · {formatDate(station.observed_at)}
              </span>
            </Popup>
          </CircleMarker>
          ))}
        </MapContainer>

        {showOverlay && <Legend min={overlay.min} max={overlay.max} />}

        <div className="map-controls">
          <button className="control-button" onClick={() => setShowOverlay((v) => !v)}>
            {showOverlay ? 'Hide' : 'Show'} temperature layer
          </button>
          <button className="control-button" onClick={() => setShowAbout((v) => !v)}>
            {showAbout ? 'Close' : 'About'}
          </button>
        </div>

        {showAbout && (
          <AboutPanel
            stationCount={data.station_count}
            snapshotLabel={formatDate(data.snapshot_date)}
            onClose={() => setShowAbout(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
