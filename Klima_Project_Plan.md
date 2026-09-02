# Klima v2 — Build & Positioning Plan

**Purpose of this file:** paste this into a new Claude project as the founding document. It defines what is being built, why, how long it should take, and what "done" means. Pair it with `Klima_Claude_Instructions.md` (the project's operating instructions).

**Created:** 30 August 2026 · **Owner:** Alexis De Schrevel · **Parent system:** Career A (Career Intelligence System)

---

## 0. How to use this file

1. Create a new Claude project named **Klima Demo**.
2. Paste `Klima_Claude_Instructions.md` into the project's custom instructions.
3. Upload or paste **this file** as a project document.
4. Start the first conversation with: *"Read the plan. Run Session 0."*
5. Keep `STATE.md` (template in §14) updated at the end of every session — it is the memory between conversations.

---

## 1. Context (so the new project doesn't start blind)

**Who is building this.** Alexis De Schrevel. ~7 years in global product/commercial roles at Bayer and BASF: Senior Product Manager of a €140M seed portfolio (60 products, 50+ countries), plus a Pricing/Commercial Excellence role where he built a pricing decision-support tool covering ~20,000 SKUs and ~€450M of business scope. Career break since Jan 2024. Based in Valencia, Spain. Bio-engineering degree plus a water resources management master's.

**Technical baseline — be realistic about this.** Python and SQL at basic-to-working level, self-taught from January 2024 onward by building rather than by coursework. Comfortable with AI-assisted development ("vibe coding"). Not a professional software engineer, and the plan must not assume otherwise. Strong at product decomposition, MVP scoping, evidence discipline, and knowing when to stop.

**What Klima v1 actually was — verified 31 Aug 2026 against the real 2024 files.** The original spec (`Project descriptions.docx`, May 2024) targeted a much bigger product than a map: an interactive weather map plus isochrones ("at X minutes from here, where has weather Y"), sport-condition matching (FindeSpot, WhenKite), forecasting, user accounts, a data-collection layer, even an API service — with a stated goal of 10,000 users and $50k/year revenue in year one. The dev environment was genuinely set up (React/TS/Vite, ESLint/Prettier, `C:\Projects\weatherscout` — the 2024 project's actual name before this 2026 rename), and real work went into sourcing station data — NOAA's ISD (Integrated Surface Database) inventory and format docs are in the old project folder. **No application source code survives.** Two GitHub repos from that era (`weatherscout`, `WeatherPlace`) contain a single commit each: one is an empty README stub, the other a barebones plain-JS/Leaflet+Mapbox-GL prototype with no visible app logic. The project stalled — plausibly at ISD's fixed-width data format, plausibly at the sheer size of the original scope.

**Status of v1:** no working codebase. **This is a rebuild from scratch**, using the 2024 spec and data-sourcing work as raw material, not as code.

> ⚠️ **Integrity constraint — now easier to honor than the original plan assumed.** Because v1's actual scope and stall point are now verified from source documents (not assumed), the honest v1 story is a *feature*, not a liability to route around: "v1 tried to be an isochrone-and-recommendation platform and stalled under its own scope; v2 does one thing, ships, and I can defend every line" is a stronger, truer answer than a vague "an earlier version I built in 2024." Use the specifics above. Do not claim v1 ever had working markers, interpolation, or a live map — it didn't get that far.

**Career context.** Per the Career A `three-paths-analysis`, this serves **Path 3 — Product Strategy / Product Ops**, whose stated gap is *direct software-product credibility, product vocabulary, and at least one product-style artifact*. It also serves as a general portfolio piece for the other two paths. It is **not** a coding-skills exhibit.

---

## 2. Objective and success criteria

**Objective:** a live, clickable web app plus a short written case study that together let Alex hold a credible 10-minute product conversation about software he shipped.

**Budget:** 10–18h build + 1.5–3h narrative ≈ **12–21 hours total**, or 2–3 focused working days.

**Done means all five:**

| # | Criterion | Test |
|---|---|---|
| 1 | Public URL loads in under 3 seconds on a cold visit | Open in a private window on mobile data |
| 2 | Works on a phone and on a shared laptop screen | Check both before any interview |
| 3 | Shows real weather-station data, not lorem ipsum | Data is traceable to a named public source |
| 4 | Interpolated surface renders and can be toggled on/off | Visible product decision, not a hidden one |
| 5 | A one-page case study exists and reads well without narration | Hand it to someone cold; they get it |

> **Criterion 4 is mandatory, not the first thing cut.** §10 originally allowed shipping without the overlay under time pressure — that directly contradicted this table. Resolved 31 Aug 2026: the overlay is the product; a station map without it is a Leaflet tutorial and proves nothing about judgement. If something has to give under time pressure, cut the variable selector or the second variable instead (see §10).

**Explicitly NOT success:** clean architecture, test coverage, TypeScript strictness, Lighthouse scores, or anything an engineer would grade. Those are the wrong scoreboard for this artifact.

---

## 3. The honest read — what this proves and what it doesn't

State this plainly now so the build doesn't drift into believing its own story.

**What it genuinely proves** 🟢

- Alex can scope, build and ship a working piece of software end to end, alone.
- He makes and can defend real product trade-offs (interpolation method, data freshness, what to leave out).
- He is fluent enough with modern web tooling and AI-assisted development to move fast.
- He finishes things — which the Career A files flag as a known personal risk ("can struggle to fully finish one task before jumping to the next"). A live URL is direct counter-evidence.

**What it does NOT prove** 🟠

- Working with engineers, designers or a backlog.
- Continuous customer discovery — there are no users, and there is no pretending otherwise.
- Product analytics fluency (activation, retention, churn, expansion).
- Operating inside release cycles, or prioritising under real constraints.

These four are exactly the gaps Alex already self-identified in the Career A research. **A map app does not close them.** What it does is buy the right to be taken seriously enough to have the conversation where those gaps get discussed rather than assumed. Anyone who claims a solo side project closes those gaps is selling something.

**Practical consequence for the build:** the written case study carries more interview weight than any additional feature. Budget accordingly — see §4.

---

## 4. Two tracks, run in parallel

The single most common failure mode here is building for 18 hours and writing nothing. Both tracks ship, or neither counts.

**Track A — Build (10–18h).** The app. Sessions 0–3.

**Track B — Narrative (1.5–3h).** The case study, the interview answers, and one screenshot or short screen recording. Session 4, but **capture material as you go**: every time a decision is made in Track A, write one line into `DECISIONS.md`. That file becomes the case study almost for free. Reconstructing decisions from memory three weeks later is how the narrative ends up generic.

---

## 5. Scope

**In scope (v2):**

- Map of weather stations for one clearly-bounded region.
- Click or hover a station to see its readings.
- An interpolated surface (IDW) for one variable, toggleable.
- A variable selector — temperature plus one other, if the data supports it cheaply.
- A colour legend with units.
- A short "About this project" panel inside the app itself.

**Out of scope — v2 ships without these, deliberately:**

- User accounts, login, any auth.
- A database or any backend service.
- Live API calls at page load.
- Forecasting, time-series animation, or a time slider.
- Multiple regions.
- Mobile-native anything.
- Test suite, CI, error monitoring.

**Forbidden — do not build these even if they seem quick:**

- A settings page.
- A "share this view" URL-state feature.
- Dark mode as a toggle (pick one theme that works and move on).
- Any chart that is not the map.

> Each out-of-scope item is a **talking point, not a failure**. "I cut the time slider because it tripled the data payload for a feature that doesn't change the product's core claim" is a stronger interview answer than the time slider itself. Write each cut into `DECISIONS.md` with its reason.

---

## 6. Technical specification

| Layer | Choice | Why this and not something else |
|---|---|---|
| Build tool | Vite | Matches v1; fastest path from zero to running |
| Framework | React 18+ with TypeScript | Matches v1; TS loose mode, not strict — this is not an engineering exercise |
| Map | Leaflet + react-leaflet | Matches v1; lighter and less fussy than Mapbox/deck.gl for this job; no API key |
| Basemap tiles | Free tile provider requiring no key | ⚠️ **Verify current terms and attribution requirements before shipping** — provider policies change and Claude's knowledge may be stale |
| Data | Static file committed to the repo | See §7 |
| Interpolation | IDW rendered to a canvas overlay | See §8 |
| Styling | Plain CSS or CSS modules | No component library, no Tailwind setup cost |
| Hosting | Vercel, Netlify or GitHub Pages — free tier | See §9 |
| Version control | Git, public repo on GitHub | The repo is part of the artifact |

**Standing rule:** if a dependency is being added to save under 30 minutes of work, don't add it.

---

## 7. Data plan

**Decision: bundle a static, curated data file in the repo. Do not call an API at runtime.**

This is the single highest-leverage decision in the plan, and it is a *product* decision worth narrating:

- The demo cannot break during an interview because of a rate limit, an expired key, a CORS policy or a provider outage.
- No secrets to manage, no serverless proxy, no cost.
- Load time drops to near-instant.
- The cost — data is a snapshot, not live — is irrelevant to what the demo needs to prove.

**Shape:** a single JSON file. Delivered: 41 stations. Per station: id, name, latitude, longitude, elevation, and measured values (temperature, humidity, wind speed, pressure — cloud cover to be added) with units and a timestamp. 13.7 KB — well under the 1 MB target.

**Decided 31 Aug 2026 — region: mainland France (+ Corsica).** Rejected Open-Meteo as the source: it serves reanalysis/model output at arbitrary coordinates, not real station observations — using it would silently violate criterion 3 in §2 (real data, not synthetic) and the whole "point data vs. the space between" premise in §11. Rejected Valencia/Spain as the region: too small a station count for a convincing surface, and no visible elevation story. France gives both a real elevation failure case (Alps/Pyrenees/Massif Central against a flat NW/W) and career-search relevance (France-first job search).

**Data source — pivoted during Session 0 execution to Météo-France SYNOP, not NOAA ISD-Lite as originally planned here.** NOAA's servers turned out to be unreachable from Claude's cloud sandbox (a network allowlist restriction, confirmed by direct testing) — not a data problem, an infrastructure one. Worked around it by driving the browser inside the Claude desktop app instead, which uses Alex's own computer's internet access. That reached `public.opendatasoft.com`, which mirrors Météo-France's official SYNOP network as a real-time JSON API: real government station data, no key required, and it includes altitude natively on every reading — directly useful for §8's elevation story. Full reasoning in `DECISIONS.md`. The 2024 project's own `isd-history.csv` (NOAA's station inventory, 381 French stations listed) remains a fallback if more density is needed later — Alex can pull it manually on his own machine, sidestepping the sandbox restriction entirely.

~~Open-Meteo — historical and current weather, generally free without a key for non-commercial use.~~ *Rejected — see above.*
~~AEMET OpenData — Spanish station network.~~ *Rejected with the region change.*
~~Meteostat — aggregates station data.~~ *Rejected — its bulk servers are also unreachable from Claude's sandbox.*
~~NOAA ISD-Lite~~ *Planned, then blocked by the sandbox network restriction above — kept as a manual fallback, not the primary source.*

**Session 0 outcome:** pulled 41 real French SYNOP stations via two query snapshots against the Opendatasoft API, deduplicated by station ID, cleaned into `data/klima_stations.json`, and recorded in `DECISIONS.md` — source, snapshot date (2026-01-15, not "today"), and the full reasoning for the source pivot.

---

## 8. Interpolation — implementation notes

**The maths.** For a grid point, the estimated value is the weighted mean of station values, weighted by inverse distance raised to a power:

```
value = Σ( vᵢ / dᵢᵖ ) / Σ( 1 / dᵢᵖ )      with p = 2 as the default
```

Handle `d = 0` explicitly by returning that station's exact value — otherwise it divides by zero on top of a station. Optionally restrict to the k nearest stations (k ≈ 8–12) or a search radius; this is both faster and more defensible than letting a station 600 km away vote.

**Distance.** An equirectangular approximation with a `cos(latitude)` correction on the longitude term is accurate enough at regional scale and much cheaper than haversine. This is a deliberate simplification — record it in `DECISIONS.md`, because "I used a flat-earth approximation because the error is negligible at 300 km and it halved the compute" is precisely the kind of judgement the artifact is meant to demonstrate.

**Rendering approach.** Compute a grid over the map's bounding box — start at roughly 150×150 cells. Write each cell's colour into an offscreen `<canvas>` via `ImageData`, then hand the canvas to a Leaflet `ImageOverlay` pinned to that bounding box.

**Performance.** 150×150 cells against 200 stations is ~4.5M distance calculations — tens of milliseconds in JavaScript. Compute **once on load**, and recompute only when the variable or the power parameter changes. **Never recompute on pan or zoom** — that is the mistake that makes the map feel broken.

**Colour scale.** Use a perceptually uniform sequential scale. Avoid rainbow/jet — it invents visual boundaries that aren't in the data, which is embarrassing in exactly the kind of conversation this artifact is designed to start. Include a legend with units. When picking the actual ramp, do the design pass properly rather than grabbing the first hex codes that come to mind.

**Known limitations — these are assets, not problems.** Have crisp answers ready:

- IDW produces bull's-eye artefacts around stations; it is a smoother, not a physical model.
- It never predicts values outside the observed range, so it flattens genuine extremes.
- It gives no uncertainty estimate. Kriging would, at a large complexity cost — a real trade-off, honestly made.
- It ignores elevation entirely, which matters enormously for temperature. A lapse-rate correction would be the first serious improvement.

That last bullet is the strongest single thing in this project. It shows domain knowledge (the water-resources background paying off), awareness of the model's limits, and a clear view of what v3 would be.

---

## 9. Deployment

- Push the repo to GitHub, public.
- Connect Vercel or Netlify to the repo; both auto-detect Vite and deploy on push, free.
- **Verify the production build before declaring done** — a Vite app can run perfectly in dev and break in production over base paths or asset URLs. Run the production build locally first, then check the deployed URL in a private window.
- Buy nothing. A `*.vercel.app` or `*.netlify.app` URL is completely fine; a custom domain adds cost and zero credibility.
- Add a short README to the repo: what it is, the stack, the data source and attribution, and how to run it.

---

## 10. Milestone plan

**Revised 31 Aug 2026 for the actual build mode: Claude generates code, Alex reviews and explains it back rather than typing it.** This moves the binding constraint from typing speed to comprehension time — §12's rule ("if a section can't be explained, it doesn't ship") is now the real bottleneck, so explain-back checkpoints are scheduled explicitly below rather than assumed. Target total: **~9–10 hours** across 1–2 days, down from the original 12–21h estimate which assumed Alex writing the code himself.

The original 10–18h/1.5–3h split also contradicted §3/§4's own conclusion that the narrative carries more interview weight than any feature, while allocating it the smallest budget. Fixed below: narrative gets 2h, not 1.5.

### Session 0 — Decisions and data · ~1h
Region, data source and stack questions closed 31 Aug 2026 (§7, §13). Pull readings for the French station shortlist, clean into JSON, commit. Create the repo, `DECISIONS.md`, `STATE.md`.
**Exit gate:** a committed JSON file with real French stations in it, and a written record of where it came from.

### Session 1 — Scaffold, map, markers · ~1.5h · ⏱ **GO / NO-GO GATE**
Vite + React + TS project running. Leaflet map rendering with the basemap. Station markers plotted from the JSON. Click a marker, see its values.
**Exit gate — the 3-hour hard ceiling from the original plan still applies even at this pace:** if there is no map with markers on it by 3 hours, stop and reassess rather than push on.
**Explain-back checkpoint:** Alex walks through the data flow (JSON → component → marker) in his own words before Session 2 starts.

### Session 2 — IDW overlay · ~3h
Grid computation, IDW function, canvas rendering, `ImageOverlay`, colour scale, legend, on/off toggle.
**Exit gate:** the surface renders, toggles, and doesn't recompute on pan. **Criterion 4 in §2 is mandatory** — this session does not get cut under time pressure; see §5/§10 note on what to cut instead if needed.
**Explain-back checkpoint — non-negotiable.** This is the one piece of the codebase an interviewer can actually probe (§12: "why IDW rather than kriging?"). Alex must be able to explain the weighting formula, the k-nearest/radius restriction, and the equirectangular distance approximation before this session closes.

### Session 3 — Design pass, polish, deploy · ~2h
One deliberate cartographic theme (not default Leaflet grey) — "looks nice" was an explicit goal for this build. Layout that works on a phone. Variable selector only if it's free. "About this project" panel. README. Deploy to Vercel. Verify on mobile and in a private window.
**Exit gate:** the live URL passes all five criteria in §2.

### Session 4 — Narrative · ~2h
The case study (§11), now including the verified v1 scope-and-stall story from §1. Interview answers (§12). One screenshot or a short screen recording.
**Exit gate:** someone who has never seen the project understands it from the case study alone.

**Cadence.** Session 2 (IDW) needs one unbroken block — interpolation debugging does not survive being picked up in slices. Sessions 0, 1, 3 and 4 are more forgiving, though the plan targets finishing inside 1–2 days per Alex's stated preference (31 Aug 2026) rather than spreading across a full week.

---

## 11. The case study — outline

One page. Roughly 400–600 words. Markdown in the repo, and a PDF or a page that can be linked. Structure:

1. **What it is** — two sentences and a screenshot. Someone should understand the product before scrolling.
2. **The problem** — station data is point data; the question people actually have is about the space between the stations.
3. **What I decided and why** — three or four decisions, each with its trade-off. Static data over a live API. IDW over kriging. One region over many. Cut features and why. *This is the section that does the work.* Everything else is context for it. **Lead with the v1→v2 scope cut** (§1): a 2024 spec that reached for isochrones, sport-matching, forecasting, user accounts and $50k/year in revenue, versus a 2026 rebuild that does one thing and ships. This is the single strongest scoping-discipline story in the project — use the real specifics from `Project descriptions.docx`, not a vague gesture at "an earlier version."
4. **What it can't do** — the limitations from §8, stated first by Alex rather than discovered by the interviewer. Owning them is worth more than hiding them.
5. **What v3 would be, and how I'd decide whether to build it** — elevation-adjusted interpolation as the obvious next step, plus a clear statement of what evidence would justify the effort. This is where product thinking shows most visibly.
6. **Stack, and honest attribution** — the stack, and one plain sentence about AI-assisted development. See §12.

---

## 12. Interview preparation

**The question that will come, and needs a prepared answer: "Did you build this, or did AI build it?"**

In 2026 this gets asked. Hedging reads worse than the honest answer. Something close to:

> "AI-assisted, and I'd say that about most code written this year. I made the architecture and product decisions — the data strategy, the interpolation method, the cell resolution, what to cut — and I can walk you through any part of it and tell you why it's that way. The typing was assisted. The judgement wasn't."

Then be able to actually do that. **Understand every part of the codebase well enough to explain it.** If a section can't be explained, it doesn't ship. That is a build rule, not just an interview tactic.

**Other questions to have answers for:**

- Why IDW rather than kriging or splines?
- Why static data instead of live?
- What would break if this had 10,000 stations instead of 200?
- Who would use this, and what would you need to learn before building v3?
- What's wrong with it?
- How long did it take? *(Answer honestly. "About two working days, rebuilt from an earlier version" is a good answer — it demonstrates scoping discipline, which is the point.)*

**How to open when showing it.** Lead with the decision, not the demo: *"I rebuilt a weather-mapping tool to have something concrete to talk about. The interesting part isn't the map, it's what I chose to leave out."* That frames the conversation around product judgement instead of inviting a code review.

---

## 13. Open decisions — closed 31 Aug 2026

1. **Region** — ~~Valencia, Spain~~ → **mainland France.** See §7 for the reasoning (real elevation story, career-search relevance, 203 usable stations).
2. **Data source** — ~~Open-Meteo~~ → ~~NOAA ISD-Lite~~ → **Météo-France SYNOP** (via public.opendatasoft.com). NOAA's servers turned out to be unreachable from Claude's cloud sandbox; Météo-France's official network is real-time, reachable, and includes altitude natively. See §7 and DECISIONS.md.
3. **Variables** — temperature, humidity, wind speed, pressure pulled; cloud cover to be added. *(Broader than the original "temperature only" recommendation — Météo-France's feed made the extra fields effectively free.)*
4. **Repo public or private?** **Public.** The existing 2024 repo is named `weatherscout` on GitHub; since the project renamed to Klima (1 Sept 2026, Alex's call), Alex will rename that repo in GitHub's own settings rather than create a new one — GitHub redirects the old URL automatically, so history and continuity are preserved. Real commit dates — no backdating. A two-day build history is an asset here (§12's "how long did it take" answer is stronger for it), not something to hide.
5. **Name** — ~~Keep "WeatherScout."~~ **Renamed to "Klima"** (1 Sept 2026, Alex's explicit request). The v1→v2 story (§11) still works — the case study should state the rename plainly ("built as WeatherScout in 2024, rebuilt and renamed Klima in 2026") rather than imply the name was always Klima.

---

## 14. `STATE.md` template

Keep this at the repo root. Update at the end of every session. It is what makes a new Claude conversation useful instead of starting from zero.

```markdown
# STATE

Last updated: YYYY-MM-DD
Current session: <0-4>
Hours spent so far: <n> of 12-21 budgeted

## Done
- ...

## In progress
- ...

## Next action
- <one concrete thing>

## Blocked / open questions
- ...

## Decisions made this session
- <decision> — <reason>   (also append to DECISIONS.md)
```

---

## 15. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Scope creep — "just one more feature" | **High** | Blows the budget, nothing ships | §5 forbidden list; Claude instructed to refuse additions |
| IDW rendering rabbit hole | Medium | Session 2 doubles | Hard 8h ceiling, then ship without the overlay |
| Data source turns out to need a key / paid tier | Medium | Session 0 stalls | Have two candidate sources ready; fall back to a bulk download |
| Narrative never gets written | **High** | The artifact loses most of its value | `DECISIONS.md` written continuously, not at the end |
| Tooling rot / dependency friction | Low–Medium | Session 1 overruns | 3-hour go/no-go gate |
| Demo breaks live during an interview | Low | Bad | Static data, no runtime API, verified on mobile beforehand |
| Over-claiming in interview | Low | **Severe** — credibility loss | §1 integrity constraint; only claim what v2 verifiably does |

---

## 16. What this plan deliberately does not do

It does not build a product. There are no users, no market, and no intention to find any. It is a **conversation object** — something that makes an interviewer ask better questions and gives Alex somewhere concrete to demonstrate judgement. Anything that doesn't serve that is out of scope, however interesting it is.

If, during the build, Klima starts looking like something worth pursuing as an actual product, that is a **separate decision** for a separate conversation — and it should be made against the Career A compass (freedom, income, interesting work, non-bullshit factor, future-proofing), not made accidentally by drifting into it.

---

## 17. Roadmap beyond v2 — phases, not this build's scope

Added 1 Sept 2026, after Alex described a fuller vision (historical daily/monthly climate aggregation, a year-range and period filter, spatial color-coding by long-term average, year-over-year comparison charts per location). That vision is real and worth having — but building it now would violate §5's forbidden list (a time-series chart, effectively a time-slider filter) and risks the one thing this whole project exists to prove: that Alex finishes things. So it's phased instead, with only Phase 1 in this build's budget.

| Phase | Scope | Status |
|---|---|---|
| **1 — Interview MVP** | Everything in §5's "in scope" list: single-snapshot spatial map, IDW interpolation, one region (France), static data. This document's Sessions 0–4. | **This build. ~9-10h. The only phase with a deadline.** |
| **2 — Basic historical layer** | Daily aggregates (precip total, temp max/min, mean cloud cover) rolled up to monthly averages per station; still just the map, still no charts or filter UI — perhaps a single toggle between "this snapshot" and "long-term average for [month]." | Future. Depends on verifying Météo-France's aggregation API is reachable the same way the snapshot API was — not yet tested. |
| **3 — Full historical explorer** | Filters for year range and aggregation period (daily/weekly/monthly); year-over-year comparison line charts per location; more detailed data. | Future, materially bigger scope — a real second product, not an extension. |
| **4 — Additional countries** | Expand beyond France. Each country is its own data-sourcing problem, similar to the France investigation in Session 0 (finding a reachable, real, station-based source with the right licence). | Future, and explicitly not attempted until Phase 3 is real — multiple regions is out of scope for a reason (§5). |

**What Phase 1 does to stay extensible without spending Phase 1's budget on Phase 2+ features:** station data lives in its own JSON file keyed by station ID, so a future `climate_normals.json` can reuse the same IDs with no rewrite; the map and overlay are written as functions that take "a dataset of per-station values" as input, so swapping which dataset feeds them later is a data change, not a rebuild; commits are real and incremental, not one giant commit, so Phase 2 starts as new history on a real project rather than a fresh start. None of this costs Phase 1 extra time — it's just not being sloppy. What Phase 1 deliberately does *not* do: build any filter UI (even hidden), integrate a charting library, or design a schema for years of data — that would be paying Phase 1's budget for Phase 2/3 features whose real shape isn't known yet.

**Case study use:** this table is stronger material for §11.5 ("what v3 would be, and how I'd decide whether to build it") than anything invented after the fact — it shows real product sequencing, not just a single "nice to have."
