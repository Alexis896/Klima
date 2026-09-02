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
        <strong>Height matters:</strong> no station here sits above 871m, so a plain blend
        would paint valley temperatures straight across the Alps. Readings are converted to
        their sea-level equivalent, blended, then brought back down using the real ground
        height at each point (−6.5°C per 1,000m).
      </p>
      <p>
        <strong>Data:</strong> a single snapshot from {snapshotLabel}, not live conditions.
      </p>
      <p>
        <strong>Known limitation:</strong> that −6.5°C/1,000m is a standard average, and real
        air doesn't always obey it. On a still winter morning like this one, cold air pools in
        valleys and the relationship can briefly invert — so mountains here are a good
        estimate, not a measurement.
      </p>
    </div>
  );
}

export default AboutPanel;
