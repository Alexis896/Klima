// Glue between the math (idw.ts), the colours (colorScale.ts), and what
// Leaflet can actually display. Leaflet doesn't know what "temperature" is
// — it only knows how to place an image on top of the map at given
// geographic bounds. So the job here is: turn our grid of numbers into an
// actual picture (a PNG, built pixel-by-pixel in memory), then hand back
// that picture plus the bounds it corresponds to.

import { computeIDWGrid, latToRowFraction, type StationPoint, type GeoBounds } from './idw';
import { valueToColor } from './colorScale';
import franceBoundary from '../data/france_boundary.json';

export interface TemperatureOverlay {
  imageUrl: string; // a data: URL — the picture, generated entirely in the browser
  bounds: GeoBounds;
  min: number;
  max: number;
}

const GRID_PADDING_DEG = 0.5; // extend past the outermost stations so the overlay doesn't clip exactly at the edge stations

// The colour field itself (how the blue-to-red gradient blends between
// stations) is smooth, slowly-changing data — it doesn't need many pixels
// to look right. The COASTLINE is the opposite: lots of sharp, jagged
// detail (river mouths, peninsulas). Using one grid for both, as the first
// version of this file did, meant picking a resolution that was too coarse
// for the coastline no matter how good the underlying map data was. This
// version separates the two: a modest grid for colour, and a separate
// vector clip (below) for the coastline, so each is only as expensive as
// it needs to be.
const GRID_COLS = 640;
const GRID_ROWS = 400;
const OVERLAY_OPACITY = 0.65; // let the map underneath still show through

type Ring = [number, number][]; // closed loop of [lon, lat] pairs
type Polygon = Ring[]; // outer ring only
type MultiPolygon = Polygon[]; // mainland, Corsica, small islands, each as its own polygon

/**
 * Turn France's real coastline coordinates into a Path2D in canvas pixel
 * space — the same shape, just re-measured in pixels instead of degrees.
 * Handing this to the canvas lets its own renderer draw and anti-alias the
 * outline directly, which is both faster and sharper than testing every
 * pixel against the coastline ourselves.
 *
 * Uses the same Mercator-aware row placement as computeIDWGrid
 * (latToRowFraction) — otherwise the coastline and the colour field would
 * each be measured on a slightly different vertical scale and drift apart
 * exactly like the earlier "shifted north" bug.
 */
function buildCoastlinePath(
  multiPolygon: MultiPolygon,
  bounds: GeoBounds,
  width: number,
  height: number
): Path2D {
  const lonToX = (lon: number) => ((lon - bounds.lonMin) / (bounds.lonMax - bounds.lonMin)) * width;
  const latToY = (lat: number) => latToRowFraction(lat, bounds) * height;

  const path = new Path2D();
  for (const polygon of multiPolygon) {
    const ring = polygon[0];
    ring.forEach(([lon, lat], i) => {
      const x = lonToX(lon);
      const y = latToY(lat);
      if (i === 0) path.moveTo(x, y);
      else path.lineTo(x, y);
    });
    path.closePath();
  }
  return path;
}

export function buildTemperatureOverlay(stations: StationPoint[]): TemperatureOverlay {
  const lats = stations.map((s) => s.lat);
  const lons = stations.map((s) => s.lon);

  const bounds: GeoBounds = {
    latMin: Math.min(...lats) - GRID_PADDING_DEG,
    latMax: Math.max(...lats) + GRID_PADDING_DEG,
    lonMin: Math.min(...lons) - GRID_PADDING_DEG,
    lonMax: Math.max(...lons) + GRID_PADDING_DEG,
  };

  const grid = computeIDWGrid(stations, bounds, GRID_COLS, GRID_ROWS, 2);

  const values = stations.map((s) => s.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const canvas = document.createElement('canvas');
  canvas.width = grid.cols;
  canvas.height = grid.rows;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  // Step 1: paint the colour field everywhere — no coastline awareness at
  // this point, just "what temperature does IDW estimate here."
  const imageData = ctx.createImageData(grid.cols, grid.rows);
  const alpha = Math.round(255 * OVERLAY_OPACITY);
  for (let i = 0; i < grid.values.length; i++) {
    const [r, g, b] = valueToColor(grid.values[i], min, max);
    imageData.data[i * 4 + 0] = r;
    imageData.data[i * 4 + 1] = g;
    imageData.data[i * 4 + 2] = b;
    imageData.data[i * 4 + 3] = alpha;
  }
  ctx.putImageData(imageData, 0, 0);

  // Step 2: cut that colour field down to France's real shape. This is a
  // standard "stencil" technique: draw the coastline as a solid shape, but
  // tell the canvas to keep only the parts of the EXISTING picture that
  // overlap it ("destination-in"), discarding everything outside — so the
  // result is our colours, precisely clipped to the coastline's own true
  // vector shape rather than to the colour grid's coarser resolution.
  const coastlinePath = buildCoastlinePath(
    franceBoundary.coordinates as unknown as MultiPolygon,
    bounds,
    grid.cols,
    grid.rows
  );
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = '#000';
  ctx.fill(coastlinePath);
  ctx.globalCompositeOperation = 'source-over'; // reset to the default for anything drawn later

  return {
    imageUrl: canvas.toDataURL(),
    bounds,
    min,
    max,
  };
}
