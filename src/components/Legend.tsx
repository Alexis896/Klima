import { legendGradientCss } from '../lib/colorScale';
import './Legend.css';

interface LegendProps {
  min: number;
  max: number;
}

/** The key that lets someone read colours on the map back as real temperatures. */
function Legend({ min, max }: LegendProps) {
  return (
    <div className="legend">
      <div className="legend-title">Temperature (°C)</div>
      <div className="legend-bar" style={{ background: legendGradientCss() }} />
      <div className="legend-labels">
        <span>{min.toFixed(1)}°</span>
        <span>{max.toFixed(1)}°</span>
      </div>
    </div>
  );
}

export default Legend;
