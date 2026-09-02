# STATE

Last updated: 2026-09-02
Current session: 5 (elevation correction — V2 feature-complete)
Hours spent so far: ~3 of ~9-10 budgeted (Session 2, 3 and 4 build time not yet added)

## Done — Session 0
- Reviewed Klima_Project_Plan.md critically against §0-16
- Investigated old v1 material: two GitHub repos (`weatherscout` — empty README stub; `WeatherPlace` — single-commit plain-JS/Leaflet+Mapbox prototype, no app logic) and local files in "Old code/Weatherscout Old/" (Project descriptions.docx = original 2024 spec, NOAA ISD data files, logo concepts)
- Confirmed no v1 application source code survives anywhere. Rebuild from scratch confirmed correct.
- Closed all 5 open decisions from original §13: region → France, data source → Météo-France SYNOP, variables → temp/humidity/wind/pressure, repo → rename `weatherscout` to `klima`, name → renamed WeatherScout → Klima
- Resolved §2/§10 contradiction: IDW overlay (criterion 4) is mandatory
- Pulled 41 real French SYNOP stations, snapshot 2026-01-15T09:00 UTC, saved to data/klima_stations.json

## Done — Session 1
- Scaffolded Vite + React + TypeScript app (`app/` folder) via `npm create vite`
- Added leaflet + react-leaflet + @types/leaflet; added `resolveJsonModule` to tsconfig so the station JSON can be imported directly as typed data
- Built App.tsx: Leaflet map centered on France, 41 stations rendered as CircleMarkers (chose CircleMarker over Leaflet's default pin icon — avoids a common bundler asset-path bug with default marker icons, and sets up nicely for Session 2's colour-by-value design), each with a Popup showing name/temperature/elevation/humidity/wind/station id/timestamp
- Verified with a headless browser + screenshots before handoff: markers plot in France's correct outline (Corsica, Brittany visible), popup opens correctly on click (tested with Orly), TypeScript compiles clean, production build succeeds
- Confirmed map tiles don't load in Claude's own verification browser (same sandbox network restriction as the NOAA issue in Session 0) — not an app bug, works fine in Alex's own browser
- Handed off all 19 source files to Klima/app/ via the device bridge
- Walked Alex through Node.js + npm installation on Windows (nodejs.org LTS installer, not the Docker instructions the download page defaults to), fixed a PowerShell script-execution-policy block on npm (`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`) — both are common first-time Windows/Node friction points, not project-specific issues, worth remembering for any future Windows setup
- Alex ran `npm install` + `npm run dev` successfully, confirmed the live app in his own browser: real map tiles, correct dots, working popups
- Explain-back checkpoint passed: quizzed Alex on data file vs. code separation, the render loop, and Leaflet's built-in popup behavior — 4/4 correct, plus a walkthrough and a ready-to-use one-paragraph interview explanation
- Second, deeper explain-back round also passed 4/4: TypeScript interfaces are compile-time-only, MapContainer vs TileLayer, where marker colours are actually set, general definition of React

## Done — Session 2
- Built `src/lib/idw.ts`: distance calc (equirectangular + cos-latitude correction) and the IDW weighted-average formula (power=2, all 41 stations, no k-nearest restriction)
- Built `src/lib/colorScale.ts`: blue→white→red diverging colour scale, scaled to the dataset's real min/max, plus a matching CSS gradient generator for the legend
- Built `src/lib/overlay.ts`: computes a 240×150 grid over the stations' extent (+0.5° padding), paints it pixel-by-pixel onto an offscreen canvas, exports it as a data-URL image
- Updated `App.tsx`: wraps the map in a positioned `.map-wrapper`, adds a Leaflet `ImageOverlay` built once via `useMemo` (empty deps — confirmed never recomputed on pan/zoom), a show/hide toggle button, and a `Legend` component (`src/components/Legend.tsx` + `.css`)
- Verified with headless-browser screenshots in both overlay-on and overlay-off states: gradient renders correctly, legend numbers (2.3°–11.9°) match the real data, toggle works, no app-level console errors (only the same known tile-loading restriction from Session 1)
- Handed off 7 files (App.tsx, App.css, lib/idw.ts, lib/colorScale.ts, lib/overlay.ts, components/Legend.tsx, components/Legend.css) to Klima/app/ via the device bridge
- Added a France coastline mask so the overlay follows the real coastline instead of a rectangle — went through two real bug fixes after Alex caught visible problems on his own machine: (1) the coastline test ran once per colour-grid cell, so the mask could only ever be as sharp as that grid regardless of the map data's precision — fixed by switching to a vector clip path (`ctx.globalCompositeOperation = 'destination-in'`) drawn directly on the canvas; (2) a genuine map-projection bug — the overlay image was built with rows evenly spaced by degrees of latitude, but Leaflet displays via the Web Mercator projection (uneven vertical spacing), causing a shift that peaked around 20–25km near Brittany's latitude and vanished at the top/bottom edges — fixed by spacing overlay rows evenly in Mercator space (new `latToRowFraction` in `idw.ts`) instead of degrees. Both fixes confirmed by Alex on his own machine (real map tiles); the coastline data itself (`data/france_boundary.json`) also got one upgrade mid-session, from a coarse ~2,000-point global dataset to a ~3,660-point Natural Earth extract, before the two real bugs were found underneath it. New file `lib/pointInPolygon.ts` from an earlier attempt is no longer used and is safe to delete.

## Done — Session 3 (design pass)
- Switched map tiles from default OpenStreetMap to CARTO Positron (muted/light basemap) — plan §10 required "one deliberate cartographic theme, not default Leaflet grey"; a quiet basemap also lets the temperature overlay read as the visual focus
- Added `components/AboutPanel.tsx` + `.css`: an in-app "About this map" panel — what it shows, the IDW method in one sentence, the data snapshot date, and the elevation limitation stated upfront
- Added a `.map-controls` button cluster (temperature toggle + About), replacing the single toggle button from Session 2
- Mobile layout pass via CSS media queries only (no new dependencies): verified at a 375px-wide viewport — header, controls, legend, and About panel all stay legible and non-overlapping; controls wrap to a second row on very narrow screens instead of overflowing
- Rewrote `README.md` from the default Vite template: what it is, the stack, data source + attribution, how to run it locally (including the Windows Node/PowerShell notes from Session 1)
- Verified with headless-browser screenshots at both desktop (1280px) and mobile (375px) widths, overlay-on and About-panel-open states, no console errors
- No variable selector built — plan said "only if it's free," and it isn't yet (only temperature has a computed overlay)

## Done — Session 3 (deploy)
- Pushed to GitHub (`github.com/Alexis896/klima`), merging in the renamed repo's original 2024 stub commit via `--allow-unrelated-histories` rather than overwriting it (see DECISIONS.md)
- Connected Vercel to the GitHub repo and deployed — live at https://klima-rho.vercel.app
- Post-deploy bug found and fixed: CARTO's basemap tiles started requiring an API key (showed an "API KEY REQUIRED" watermark in production, though it worked in local dev) — switched to standard OpenStreetMap tiles, which need no key. Confirmed live via a real browser: tiles render correctly, all 41 station dots align to the coastline, temperature-layer toggle works, About panel works, no console errors, mobile viewport (375px) is clean.
- Live URL added to README.md

## Verified against plan §2 success criteria
1. Public URL loads quickly on a cold visit — pass (verified via real browser)
2. Works on phone and laptop screen — pass (375px and desktop both checked)
3. Shows real weather-station data, traceable to a named source — pass (Météo-France SYNOP, cited in README)
4. Interpolated surface renders and toggles on/off — pass (verified live)
5. A one-page case study exists and reads well cold — **not yet — this is Session 4's deliverable**, not part of Session 3's scope

## Done — Session 4 (narrative)
- Cumulative quiz (Sessions 1–3) passed 4/4: Vite as build tool/dev server, IDW's inverse-square weighting logic, why the coastline mask was grid-resolution-limited before the vector-clip fix, why the CARTO tiles broke only in production
- Wrote `CASE_STUDY.md` (one-pager, ~500 words, plan §11 structure): what it is, the problem, what was built (featuring the Mercator debugging story as a full paragraph per Alex's call), what it can't do, what v3 would be, stack + AI-assisted attribution
- Wrote `INTERVIEW_PREP.md` — private prepared answers to plan §12's anticipated questions (why IDW vs. kriging/splines, why static data, what breaks at 10,000 stations, who'd use this, what's wrong with it, how long it took), not published publicly
- Published the case study as a shareable page via the Artifact tool (in addition to the repo markdown) so it can be sent directly without pointing someone at GitHub
- Added `CASE_STUDY.md` to README's "Project docs" list
- Files not yet pushed to GitHub — pending Alex's `git add` / `commit` / `push`

## Fixed — repo-root mixup (2 Sept 2026)
- Discovered the actual git repo root is `Klima/app/`, not the parent `Klima/` folder — DECISIONS.md, STATE.md, Klima_Project_Plan.md, and CASE_STUDY.md were never actually tracked or pushed, despite README.md linking to them as if they were in the repo. Fixed by copying all four into `app/` alongside README.md. `INTERVIEW_PREP.md` intentionally stays at the parent level, outside the repo folder entirely.
- Confirmed pushed: commit `2f6b70a`, "5 files changed, 594 insertions" — `git status` before the push showed exactly the 4 expected new files and nothing from `INTERVIEW_PREP.md` or `Old code/`.
- **Convention going forward:** DECISIONS.md, STATE.md, CASE_STUDY.md, and Klima_Project_Plan.md are edited in Claude's workspace as before, but now get committed to `Klima/app/` on Alex's machine (the real repo root) — never the parent `Klima/` folder.

## Done — Session 5 (elevation correction)
- Added `lib/elevation.ts` + `data/france_elevation.json`: a 78 × 120 grid (~14km) of real ground elevations over the map's bounds, bilinearly interpolated at lookup. Sourced from SRTM 90m via the OpenTopoData public API, fetched through the browser on Alex's machine (Claude's sandbox can't reach it), verified against known points (Mont Blanc area 3,052m, Pyrenees 1,596m, Toulouse 167m, Brest 84m)
- `idw.ts`: added `LAPSE_RATE_C_PER_M` (0.0065) and optional elevation correction in `computeIDWGrid` — station readings normalised to sea level, blended, then brought back down at each grid point's own height. Also exported `rowFractionToLat` (inverse of the existing Mercator row helper)
- `overlay.ts`: colour scale now derived from cells **inside France only** (2nd–98th percentile), not the whole rectangle — the grid's corners hold Swiss/Italian Alps (−13°C) and open ocean that nobody sees, and letting those set the scale was simply wrong. This is what `lib/pointInPolygon.ts` is now for: too coarse for masking, exactly right for sampling statistics. It is no longer dead code.
- `AboutPanel.tsx`: elevation limitation replaced (it's now false) with the real remaining caveat — a fixed lapse rate can invert on still winter mornings when cold air pools in valleys
- README, CASE_STUDY.md and INTERVIEW_PREP.md updated; case study's "what v3 would be" rewritten (elevation *was* its answer) around the inverse query — "given my constraints, where should I go?"
- Verified: build clean, no console errors, desktop + 375px mobile screenshots, About panel fits within the mobile viewport. Legend now reads −2.0° to 10.3° (was 2.3°–11.9° on station readings alone)

## Measured, for the record
On this snapshot, inside France: p2 ≈ −2.0°C, median 8.2°C, p98 ≈ 10.3°C, and 89% of French land sits at or above 5°C. The middle 50% of the country spans just 7.0–8.9°C. The lowlands genuinely are near-uniform on a January morning; the mountains are what vary. That's why the corrected map looks the way it does — it isn't a scaling bug.

## Next action
- Alex pushes Session 5 from `Klima/app/`
- Then: V3 scoping in a fresh conversation. Leading candidate (Claude's recommendation, Alex to decide): the inverse query — "given my constraints, where should I go?" — because it makes the interpolated surface load-bearing instead of decorative, and revives the original 2024 concept in minimal form. Agreed already: more countries is not a priority.

## Blocked / open questions
- None currently blocking. Note for later: data snapshot date is 2026-01-15, not current — case study/README must say "a January 2026 snapshot," never "live" or "current conditions."
- Station-count sparseness watch item from Session 1 resolved by observation: the rendered interpolation surface with 41 stations looks visually convincing (smooth gradient, no obvious dead zones) — no fallback data pull needed.

## Decisions made — Session 0
- Region: mainland France (+ Corsica), not Valencia/Spain
- Data source: Météo-France SYNOP (via public.opendatasoft.com), pivoted from NOAA ISD-Lite — NOAA unreachable from Claude's cloud sandbox
- Repo: rename existing public `weatherscout` GitHub repo to `klima` rather than create new
- v1 narrative: describe honestly with real specifics from Project descriptions.docx
- Build/execution model: Claude builds in its cloud workspace, hands off files via the device bridge; GitHub push method to be confirmed at Session 3
- Historical/temporal "climate explorer" vision: deferred to a documented Phase 2-4 roadmap (plan §17), not built now — see DECISIONS.md

## Decisions made — Session 1
- CircleMarker used instead of Leaflet's default pin icon — sidesteps a known Vite/Leaflet bundler asset-path bug and gives Session 2 a head start on colour-coded dots
- No design pass yet (deliberately) — current look is functional placeholder; the real design pass is scheduled for Session 3 per the plan

## Decisions made — Session 2
- Temperature is the only interpolated variable for now (headline metric, same code path reusable for other fields later)
- All 41 stations used per grid point, no k-nearest/radius restriction — simple and cheap at this station count
- Power fixed at 2 (standard default), not exposed as a control — a power slider is a Phase 3 filter-style feature
- Grid bounds = station extent + 0.5° padding, not France's political border
- Colour scale fixed palette, scaled to each snapshot's real min/max (not a fixed global range)
- Coastline masked via a vector clip path (not per-pixel testing) — sharpness independent of colour-grid resolution
- Overlay rows spaced evenly in Web Mercator space, not plain degrees of latitude — matches how Leaflet actually projects the map
- Explain-back + cumulative quiz (Session 1 + Session 2) passed 4/4: the render loop, IDW's 1/distance² weighting, colorScale.ts (translator) vs overlay.ts (assembly line) roles, and why the Mercator projection mismatch caused the shift

## Decisions made — Session 3
- Tile theme: CARTO Positron (free, no API key) instead of default OSM tiles
- No variable selector — not "free" yet, since only temperature has a computed overlay
- About panel is in-app text, no external links yet (repo URL not final until deploy)
- Mobile layout via plain CSS media queries, no new dependencies
