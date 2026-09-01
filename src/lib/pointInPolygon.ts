// "Is this point on land?" — a classic geometry test called ray casting.
// Picture drawing a straight line from the point out to infinity and
// counting how many times it crosses the shape's outline: an odd number of
// crossings means you're inside, an even number means you're outside.
// This is what lets us mask the interpolation overlay to France's actual
// coastline instead of a plain rectangle.

type Ring = [number, number][]; // a closed loop of [lon, lat] pairs
type Polygon = Ring[]; // outer ring only — this dataset has no holes/enclaves to worry about
type MultiPolygon = Polygon[]; // several separate landmasses: mainland, Corsica, small islands

interface PreparedPolygon {
  ring: Ring;
  bboxLonMin: number;
  bboxLonMax: number;
  bboxLatMin: number;
  bboxLatMax: number;
}

/**
 * Precompute each landmass's bounding box once, up front. When we later test
 * ~36,000 grid points against a coastline with thousands of vertices, most
 * points aren't even close to most landmasses (a grid point over the
 * Atlantic doesn't need the full, expensive check against Corsica's
 * outline) — so a cheap box check first lets us skip the detailed one
 * almost all of the time.
 */
export function preparePolygons(multiPolygon: MultiPolygon): PreparedPolygon[] {
  return multiPolygon.map((polygon) => {
    const ring = polygon[0];
    const lons = ring.map((p) => p[0]);
    const lats = ring.map((p) => p[1]);
    return {
      ring,
      bboxLonMin: Math.min(...lons),
      bboxLonMax: Math.max(...lons),
      bboxLatMin: Math.min(...lats),
      bboxLatMax: Math.max(...lats),
    };
  });
}

function isInsideRing(lon: number, lat: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const crosses = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
}

/** Is (lon, lat) inside any of the landmasses that make up France's shape? */
export function isInsideFrance(lon: number, lat: number, polygons: PreparedPolygon[]): boolean {
  for (const p of polygons) {
    if (lon < p.bboxLonMin || lon > p.bboxLonMax || lat < p.bboxLatMin || lat > p.bboxLatMax) {
      continue; // quick reject — nowhere near this landmass
    }
    if (isInsideRing(lon, lat, p.ring)) return true;
  }
  return false;
}

export type { MultiPolygon, PreparedPolygon };
