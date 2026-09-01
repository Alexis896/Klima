import './AboutPanel.css';

interface AboutPanelProps {
  stationCount: number;
  snapshotLabel: string;
  onClose: () => void;
}

/** A short, plain-language explanation of what this map is and isn't. */
function AboutPanel({ stationCount, snapshotLabel, onClose }: AboutPanelProps) {
  return (
    <div className="about-panel">
      <div className="about-panel-header">
        <strong>About this map</strong>
        <button className="about-panel-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <p>
        Klima interpolates temperature across France from {stationCount} real Météo-France
        weather stations — the coloured surface is an estimate for the space{' '}
        <em>between</em> stations, not a measurement.
      </p>
      <p>
        <strong>Method:</strong> Inverse Distance Weighting (IDW) — every point on the map
        blends the readings of all {stationCount} stations, weighted so closer stations count
        for more.
      </p>
      <p>
        <strong>Data:</strong> a single snapshot from {snapshotLabel}, not live conditions.
      </p>
      <p>
        <strong>Known limitation:</strong> IDW doesn't account for elevation, so mountain
        regions (Alps, Pyrenees) can be smoothed out more than they should be — a clear next
        step, not an oversight.
      </p>
    </div>
  );
}

export default AboutPanel;
