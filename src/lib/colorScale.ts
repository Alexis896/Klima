// Turns a number (a temperature) into a colour, so the eye can read the
// interpolated grid at a glance. Cold = blue, hot = red — the same
// convention almost every weather map uses, so it needs no explanation in
// an interview.

type RGB = [number, number, number];

// Colour stops from cold to hot (a standard "diverging" palette).
// Each stop is [position 0-1, [r, g, b]]. Colours in between two stops are
// blended proportionally.
const STOPS: Array<{ t: number; rgb: RGB }> = [
  { t: 0.0, rgb: [33, 102, 172] }, // dark blue — coldest
  { t: 0.25, rgb: [103, 169, 207] },
  { t: 0.5, rgb: [247, 247, 247] }, // near-white — the middle of the range
  { t: 0.75, rgb: [239, 138, 98] },
  { t: 1.0, rgb: [178, 24, 43] }, // dark red — hottest
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** value -> [r, g, b], where value is scaled against [min, max] for this dataset. */
export function valueToColor(value: number, min: number, max: number): RGB {
  // Normalise the real-world value to a 0-1 position on the scale.
  const t = max === min ? 0.5 : Math.min(1, Math.max(0, (value - min) / (max - min)));

  // Find which two stops this position falls between, and blend them.
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (t >= a.t && t <= b.t) {
      const localT = (t - a.t) / (b.t - a.t);
      return [
        Math.round(lerp(a.rgb[0], b.rgb[0], localT)),
        Math.round(lerp(a.rgb[1], b.rgb[1], localT)),
        Math.round(lerp(a.rgb[2], b.rgb[2], localT)),
      ];
    }
  }
  return STOPS[STOPS.length - 1].rgb;
}

/** CSS gradient string for the legend bar — same stops, so the legend always matches the map exactly. */
export function legendGradientCss(): string {
  const parts = STOPS.map((s) => {
    const [r, g, b] = s.rgb;
    return `rgb(${r}, ${g}, ${b}) ${s.t * 100}%`;
  });
  return `linear-gradient(to right, ${parts.join(', ')})`;
}
