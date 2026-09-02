// Ground elevation lookup.
//
// Temperature falls as you climb — which is why a temperature map built only
// from low-altitude weather stations quietly lies about mountains. To correct
// for that (see idw.ts) we need to know the ground height at every point on
// the map, not just at the 41 stations.
//
// This file bundles a pre-fetched grid of real elevations covering France,
// and looks up any lat/lon inside it. The grid is coarse (roughly 14km
// between points) — enough to capture the Alps, Pyrenees and Massif Central
// as the large landforms they are, not enough to resolve an individual
// valley. That's a deliberate trade: a finer grid would be a much larger
// file for detail this map can't show anyway.

import elevationData from '../data/france_elevation.json';

interface ElevationGrid {
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
  rows: number;
  cols: number;
  /** Row-major, row 0 = north (latMax). Metres above sea level. */
  values: number[];
}

const grid = elevationData as ElevationGrid;

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

/**
 * Ground elevation in metres at a given point, bilinearly interpolated
 * between the four surrounding grid points (so the result changes smoothly
 * rather than jumping in steps as you cross grid lines).
 *
 * Note the grid's rows are evenly spaced in DEGREES of latitude, because
 * that's how the elevations were sampled — so this converts a latitude to a
 * row position linearly. That is deliberately NOT the Mercator spacing used
 * for the overlay image's rows: this function is asked for a real-world
 * lat/lon, not a pixel position, so the two never need to agree.
 */
export function elevationAt(lat: number, lon: number): number {
  const rowPos =
    ((grid.latMax - lat) / (grid.latMax - grid.latMin)) * (grid.rows - 1);
  const colPos =
    ((lon - grid.lonMin) / (grid.lonMax - grid.lonMin)) * (grid.cols - 1);

  const r0 = clamp(Math.floor(rowPos), 0, grid.rows - 1);
  const c0 = clamp(Math.floor(colPos), 0, grid.cols - 1);
  const r1 = clamp(r0 + 1, 0, grid.rows - 1);
  const c1 = clamp(c0 + 1, 0, grid.cols - 1);

  // How far between the two rows (and the two columns) the point sits.
  const rFrac = clamp(rowPos - r0, 0, 1);
  const cFrac = clamp(colPos - c0, 0, 1);

  const topLeft = grid.values[r0 * grid.cols + c0];
  const topRight = grid.values[r0 * grid.cols + c1];
  const bottomLeft = grid.values[r1 * grid.cols + c0];
  const bottomRight = grid.values[r1 * grid.cols + c1];

  const top = topLeft + (topRight - topLeft) * cFrac;
  const bottom = bottomLeft + (bottomRight - bottomLeft) * cFrac;
  const height = top + (bottom - top) * rFrac;

  // Sea and below-sea-level points (parts of the Netherlands, tidal flats)
  // are treated as sea level — this map has nothing useful to say about them.
  return height > 0 ? height : 0;
}
