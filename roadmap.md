# Companion animation refinement (Objective_pasted-2.md)

Fix ambiguous targets, disappearing during scroll, invisible environment transitions, and nav precedence — without redesigning anything.

- [x] Inspect existing implementation and identify root causes
- [x] Deterministic, direction- and ownership-aware section claim (useCompanion)
- [x] Click claims last until destination reached; user input overrides (useCompanion)
- [x] Nav click starts the two-stage trip immediately (useCompanion click handler)
- [x] Visible arc journeys instead of fade-out/fade-in travel (PixelCompanion.travelTo)
- [x] Hold last stable perch instead of vanishing when no perch is reachable (refresh + onActiveChange)
- [x] One flight at a time; scroll flips during a jump wait for landing
- [x] Verify: scroll-down, scroll-up, contact→footer, footer→hero, nav from bottom, rapid scroll (Playwright)
