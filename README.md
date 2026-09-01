# Klima

An interactive map of France that estimates temperature across the whole country from real
weather station readings — not just at the stations themselves, but the space in between.

**Live demo:** _add the deployed URL here once Session 3's deploy step is done_

## What it does

- Plots 41 real Météo-France weather stations across mainland France and Corsica, each with a
  popup showing temperature, humidity, wind, and elevation.
- Estimates temperature everywhere else using **Inverse Distance Weighting (IDW)** — a spatial
  interpolation method that blends nearby stations' readings, weighted so closer stations count
  for more (`weight = 1 / distance²`).
- Renders that estimate as a coloured overlay, masked precisely to France's real coastline (not
  a rectangle), with a matching legend.
- Toggle the overlay on/off, and an in-app "About" panel explaining the method and its
  limitations.

## Data

- **Source:** [Météo-France's SYNOP network](https://public.opendatasoft.com/explore/dataset/donnees-synop-essentielles-omm/), France's official surface weather station network, accessed via the Opendatasoft public API.
- **Snapshot:** a single point in time (15 January 2026, 09:00 UTC) — bundled as a static file
  in this repo, not a live feed. This is a deliberate scope decision (see `DECISIONS.md`), not
  a limitation of the data source itself.
- **Coverage:** 41 stations across mainland France and Corsica.
- **Coastline shape:** [Natural Earth](https://www.naturalearthdata.com/), 1:10,000,000 scale, used to mask the overlay to France's real outline.

## Stack

- [Vite](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript
- [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/) for the map
- Plain CSS — no component library or CSS framework
- The interpolation grid, coastline masking, and colour scale are all computed client-side, in
  the browser, from the bundled station data — there is no backend or build-time data pipeline
- Map tiles: [OpenStreetMap](https://www.openstreetmap.org/) standard raster tiles (no API key,
  no account — see `DECISIONS.md` for why this replaced an initial CARTO Positron theme)

## Running it locally

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

**First time on Windows?** Two things that trip people up and aren't specific to this project:

1. On [nodejs.org](https://nodejs.org)'s download page, make sure you're downloading the plain
   **Windows Installer (.msi)** — the page sometimes defaults to showing Docker install
   instructions instead.
2. If `npm` fails with a message about script execution being disabled, run this once in
   PowerShell: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` — this is
   a standard one-time Windows security setting, not an error in the project.

## A note on how this was built

AI-assisted, in a handful of focused sessions — and I'd say that about most code written in
2026. The architecture and product decisions (the data strategy, the interpolation method, the
grid resolution, what to cut and what to keep in scope) were mine; the typing was assisted. Full
reasoning for every non-trivial decision is logged in `DECISIONS.md` as it was made, not written
up afterward.

## Project docs

- `Klima_Project_Plan.md` — the original plan and scope
- `DECISIONS.md` — a running log of every non-trivial decision, with reasoning, in the order made
- `STATE.md` — current build status, session by session
