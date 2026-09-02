// IDW = Inverse Distance Weighting.
//
// The idea: to guess the temperature at a point with no station, blend the
// temperatures of every station we DO have, giving more influence to
// stations that are closer. "Weight" = influence. A station's weight is
// 1 / distance^power — so doubling the distance to a station cuts its
// influence by 2^power (with power=2, by 4x). power=2 is the standard
// default for this technique.

export interface StationPoint {
  lat: number;
  lon: number;
  value: number;
  /** Metres above sea level. Used for the lapse-rate correction below. */
  elevation?: number;
}

const EARTH_RADIUS_KM = 6371;

/**
 * The environmental lapse rate: how fast air temperature falls as you climb.
 *
 * ~6.5°C per 1000m is the standard atmospheric average. It matters here
 * because every one of our 41 stations sits between 2m and 871m — there is
 * no station anywhere near an Alpine summit. Blending station readings
 * without accounting for height would quietly paint valley temperatures
 * across a 4000m mountain range, which is the single biggest way a map like
 * this can be confidently wrong.
 */
export const LAPSE_RATE_C_PER_M = 0.0065;

/**
 * Approximate distance between two lat/lon points, in kilometres.
 *
 * Lines of longitude squeeze together near the poles, so 1 degree of
 * longitude is NOT the same distance as 1 degree of latitude except at the
 * equator. We correct for that with a cos(latitude) factor before applying
 * flat-plane (Pythagorean) distance. This approximation is accurate to a
 * fraction of a percent across a region the size of France — no need for
 * the full spherical (great-circle) formula here.
 */
function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const avgLatRad = (((lat1 + lat2) / 2) * Math.PI) / 180;
  const dLon = (lon2 - lon1) * Math.cos(avgLatRad);
  const dLat = lat2 - lat1;
  const degrees = Math.sqrt(dLon * dLon + dLat * dLat);
  return degrees * (Math.PI / 180) * EARTH_RADIUS_KM;
}

/** Estimate the value at (lat, lon) by blending every station, weighted by 1/distance^power. */
export function idwEstimate(
  lat: number,
  lon: number,
  stations: StationPoint[],
  power = 2
): number {
  let weightedSum = 0;
  let weightTotal = 0;

  for (const station of stations) {
    const d = distanceKm(lat, lon, station.lat, station.lon);

    // If we're (essentially) standing on a station, just use its real
    // reading instead of dividing by a near-zero distance.
    if (d < 0.01) {
      return station.value;
    }

    const weight = 1 / Math.pow(d, power);
    weightedSum += weight * station.value;
    weightTotal += weight;
  }

  return weightedSum / weightTotal;
}

export interface GeoBounds {
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
}

export interface Grid {
  values: Float32Array; // row-major, row 0 = north (latMax)
  cols: number;
  rows: number;
  bounds: GeoBounds;
}

// --- Web Mercator, the projection Leaflet (and Google/Apple/OSM) maps use ---
//
// A France-sized overlay has to account for one more thing: Leaflet doesn't
// display the earth as a plain grid of equal-sized latitude/longitude
// squares. It uses the Web Mercator projection, which stretches the map
// vertically more and more the further you get from the equator — that's
// why Greenland looks huge on a world map even though it's much smaller
// than Africa in reality. If we built our overlay image with rows evenly
// spaced by DEGREES of latitude, then handed it to Leaflet, Leaflet would
// stretch it to fit its own (non-evenly-spaced) Mercator rows — and
// everything in between the very top and bottom edges would land in
// slightly the wrong place. Across France's ~9 degrees of latitude this
// mismatch peaks at roughly 20-25km in the middle of the country — small
// on a whole-France view, but obvious once zoomed into a single coastline.
// The fix: space our image's rows the same (uneven) way Mercator does, so
// Leaflet's stretch lines them up correctly.

/** Latitude (degrees) -> position on the Mercator projection's vertical axis. */
function mercatorLatToY(latDeg: number): number {
  const rad = (latDeg * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + rad / 2));
}

/** The inverse: a Mercator vertical position -> latitude (degrees). */
function mercatorYToLat(y: number): number {
  return (2 * Math.atan(Math.exp(y)) - Math.PI / 2) * (180 / Math.PI);
}

/**
 * Lay an invisible grid of points over the given bounds and run idwEstimate
 * at every single one. This is the expensive-sounding but actually cheap
 * step: tens of thousands of grid points x 41 stations is still well under
 * a second in a browser.
 */
export function computeIDWGrid(
  stations: StationPoint[],
  bounds: GeoBounds,
  cols: number,
  rows: number,
  power = 2,
  elevationAt?: (lat: number, lon: number) => number
): Grid {
  const values = new Float32Array(cols * rows);
  const lonStep = (bounds.lonMax - bounds.lonMin) / (cols - 1);

  // --- Height correction, in three steps ---
  //
  // Interpolating raw readings directly would treat a 4000m summit as if it
  // were just "more of the valley next door". Instead:
  //
  //   1. Convert every station's reading to what it would be at sea level,
  //      by adding back the cooling its own altitude caused.
  //   2. Interpolate THOSE sea-level values — a much smoother field, because
  //      the biggest local distortion (terrain) has been taken out of it.
  //   3. Convert back down at each grid point, using that point's own ground
  //      height.
  //
  // The interpolation in the middle is unchanged; all that changed is what
  // is being interpolated. Without an elevation lookup this falls back to
  // plain IDW on the raw readings.
  const correctForHeight = typeof elevationAt === 'function';
  const points: StationPoint[] = correctForHeight
    ? stations.map((s) => ({
        ...s,
        value: s.value + LAPSE_RATE_C_PER_M * (s.elevation ?? 0),
      }))
    : stations;

  // Longitude stays evenly spaced — Mercator doesn't distort east-west.
  // Latitude does not: each row's latitude comes from an even step in
  // Mercator-Y space, then converted back to a real latitude.
  const mercMax = mercatorLatToY(bounds.latMax);
  const mercMin = mercatorLatToY(bounds.latMin);

  for (let row = 0; row < rows; row++) {
    const t = rows === 1 ? 0 : row / (rows - 1); // 0 at the top (north) to 1 at the bottom (south)
    const lat = mercatorYToLat(mercMax + t * (mercMin - mercMax));
    for (let col = 0; col < cols; col++) {
      const lon = bounds.lonMin + col * lonStep;
      let estimate = idwEstimate(lat, lon, points, power);
      if (correctForHeight) {
        estimate -= LAPSE_RATE_C_PER_M * elevationAt(lat, lon);
      }
      values[row * cols + col] = estimate;
    }
  }

  return { values, cols, rows, bounds };
}

/**
 * Convert a real latitude to its fractional row position (0 = north edge,
 * 1 = south edge) within a grid built by computeIDWGrid over these bounds.
 * Used to place other geographic data (like the coastline outline) onto
 * the exact same pixel grid, so everything drawn on the overlay lines up.
 */
/** The inverse of latToRowFraction: which real latitude a grid row sits at. */
export function rowFractionToLat(fraction: number, bounds: GeoBounds): number {
  const mercMax = mercatorLatToY(bounds.latMax);
  const mercMin = mercatorLatToY(bounds.latMin);
  return mercatorYToLat(mercMax + fraction * (mercMin - mercMax));
}

export function latToRowFraction(lat: number, bounds: GeoBounds): number {
  const mercMax = mercatorLatToY(bounds.latMax);
  const mercMin = mercatorLatToY(bounds.latMin);
  return (mercMax - mercatorLatToY(lat)) / (mercMax - mercMin);
}
