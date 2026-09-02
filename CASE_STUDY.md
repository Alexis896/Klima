# Klima — mapping the space between weather stations

*I rebuilt a weather-mapping tool to have something concrete to talk about. The interesting part isn't the map — it's what I chose to leave out.*

**Live:** [klima-rho.vercel.app](https://klima-rho.vercel.app) · **Code:** [github.com/Alexis896/klima](https://github.com/Alexis896/klima)

## What it is

Klima is an interactive map of France that estimates temperature everywhere between 41 real weather stations — not just at the stations themselves. Each station shows its actual reading; the coloured surface fills in a reasonable estimate for everywhere else, clipped precisely to the real coastline.

## The problem

A weather station gives you a data point. It doesn't answer the question people actually have, which is "what's it like at the specific place I care about" — and that place is almost never exactly on top of a station. Turning scattered points into a continuous, trustworthy surface is a spatial-interpolation problem, not a plotting problem. Klima exists to demonstrate one honest way of solving it.

## What I built, and the decisions underneath it

I first scoped this project in 2024, as "WeatherScout" — isochrones, sport-condition matching, forecasting, user accounts, a real revenue target. It stalled, most likely at the raw data format of the source I'd picked, and no working code survived. Rebuilding it in 2026, I cut it down to one clearly bounded question and actually shipped it: an IDW (Inverse Distance Weighting) surface over real Météo-France station data, where every point on the map blends nearby stations' readings, weighted so closer stations count more.

The more interesting decision wasn't the interpolation math — it was the debugging underneath it. The coastline mask looked visibly wrong three separate times as I improved it. The real bug, when I finally isolated it, wasn't the data or the math at all: it was a map-projection mismatch. Web maps render using the Mercator projection, which stretches distances non-uniformly the further you get from the equator; my overlay image had been built assuming a flat, evenly-spaced grid. I quantified the resulting error numerically — it peaked at roughly 20–25km near Brittany's latitude — *before* writing the fix, so I could confirm it actually matched what I was seeing rather than guessing and hoping.

## What it can't do

IDW produces small bull's-eye rings directly around each station — it's a smoother, not a physical model. It never predicts outside the range of the values it's given, so it flattens real extremes. It gives no uncertainty estimate the way a method like kriging would, at a complexity cost I decided wasn't worth it here. And it ignores elevation entirely, which matters enormously for temperature — the Alps and Pyrenees get smoothed out against the surrounding lowlands in a way that isn't physically right.

## What v3 would be

Elevation is the obvious next step: a lapse-rate correction (temperature drops roughly 6.5°C per 1,000m of elevation) would fix the model's biggest real weakness directly. Beyond that, I already scoped — but deliberately didn't build — a phased roadmap covering historical data, year-over-year comparison, and a broader variable set. I'd build the elevation correction first, and only go further than that if this were becoming a real product rather than a portfolio piece — which is a separate decision, made deliberately, not something to drift into by default.

## Stack, and how this was built

Vite, React, TypeScript, and Leaflet; the interpolation, coastline masking, and colour scale all run client-side, with no backend. Deployed on Vercel via GitHub.

AI-assisted, and I'd say that about most code written this year. I made the architecture and product decisions — the data strategy, the interpolation method, the grid resolution, what to cut — and I can walk through any part of this and explain why it's built that way. The typing was assisted. The judgement wasn't.
