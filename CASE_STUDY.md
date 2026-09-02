# Klima — mapping the space between weather stations

*I rebuilt a weather-mapping tool to have something concrete to talk about. The interesting part isn't the map — it's what I chose to leave out.*

**Live:** [klima-rho.vercel.app](https://klima-rho.vercel.app) · **Code:** [github.com/Alexis896/klima](https://github.com/Alexis896/klima)

## What it is

Klima is an interactive map of France that estimates temperature everywhere between 41 real weather stations — not just at the stations themselves. Each station shows its actual reading; the coloured surface fills in a reasonable estimate for everywhere else, clipped precisely to the real coastline.

## The problem

A weather station gives you a data point. It doesn't answer the question people actually have, which is "what's it like at the specific place I care about" — and that place is almost never exactly on top of a station. Turning scattered points into a continuous, trustworthy surface is a spatial-interpolation problem, not a plotting problem. Klima exists to demonstrate one honest way of solving it.

## What I built, and the decisions underneath it

I first scoped this project in 2024, as "WeatherScout" — isochrones, sport-condition matching, forecasting, user accounts, a real revenue target. It stalled, most likely at the raw data format of the source I'd picked, and no working code survived. Rebuilding it in 2026, I cut it down to one clearly bounded question and actually shipped it: an IDW (Inverse Distance Weighting) surface over real Météo-France station data, where every point on the map blends nearby stations' readings, weighted so closer stations count more.

One correction matters more than the rest. No station in the dataset sits above 871m, so blending raw readings paints valley temperatures straight across a 4,000m mountain range. Klima converts each reading to its sea-level equivalent, blends *those*, then brings the result back down using the real ground height at every point on the map (−6.5°C per 1,000m, the standard lapse rate). The interpolation itself is untouched; only what gets interpolated changed. It's the difference between a map that looks plausible and one that knows the Alps are there.

The more interesting decision wasn't the interpolation math — it was the debugging underneath it. The coastline mask looked visibly wrong three separate times as I improved it. The real bug, when I finally isolated it, wasn't the data or the math at all: it was a map-projection mismatch. Web maps render using the Mercator projection, which stretches distances non-uniformly the further you get from the equator; my overlay image had been built assuming a flat, evenly-spaced grid. I quantified the resulting error numerically — it peaked at roughly 20–25km near Brittany's latitude — *before* writing the fix, so I could confirm it actually matched what I was seeing rather than guessing and hoping.

## What it can't do

IDW produces small bull's-eye rings directly around each station — it's a smoother, not a physical model. It gives no uncertainty estimate the way a method like kriging would, at a complexity cost I decided wasn't worth it here. The elevation correction uses a single standard lapse rate, and real air doesn't always obey it: on a still winter morning like this snapshot, cold air pools in valleys and the relationship can locally invert. And the elevation grid is deliberately coarse (~14km), so it knows about the Alps but not about any particular valley.

Worth saying plainly: this map is a good estimate presented honestly, not a measurement.

## What v3 would be

The interesting gap isn't accuracy, it's that the map answers a question nobody urgently has. Every weather product answers "what's the weather at this place." The version worth building next inverts it: *given my constraints — this temperature range, this much wind, this far from me — where should I go?* That's the direction that makes the interpolation load-bearing rather than decorative, because you cannot answer "where" from 41 discrete points; you need a value everywhere, which is exactly what this surface is.

I'd decide whether to build it the same way I decided everything else here: it's cheap to test the idea on a handful of real people before writing any of it, and if nobody wants the inverse query, the honest answer is that this stays a well-built demonstration rather than becoming a product.

## Stack, and how this was built

Vite, React, TypeScript, and Leaflet; the interpolation, coastline masking, elevation correction and colour scale all run client-side, with no backend. Station data from Météo-France's SYNOP network; ground elevation pre-sampled from SRTM and bundled as a static grid. Deployed on Vercel via GitHub.

AI-assisted, and I'd say that about most code written this year. I made the architecture and product decisions — the data strategy, the interpolation method, the grid resolution, what to cut — and I can walk through any part of this and explain why it's built that way. The typing was assisted. The judgement wasn't.
