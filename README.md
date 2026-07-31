# Schism Codex

A local-first, modular world bible and narrative campaign manager for **The Analog Schism**.

The authoritative `World Bible v1.0` is bundled at `public/seed/world-bible-v1.md`. On first launch the app creates a structured IndexedDB project containing Custodian, the Blight, the Grey Hour, the Concord Five, Weaver currents, Node 04, the clean-water crisis, city layers, technology constraints, timeline events, open questions and story hooks.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local address Vite prints, normally `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Tests

```bash
npm run test
```

## Implemented MVP

- Dark, responsive dashboard summarising the clean-water crisis, faction conflicts and Node 04.
- Dynamic module types, including user-created categories.
- Lore library with search, filtering, grid/list views and canon states.
- Rich-text lore editor with autosave, tags, aliases, locking and revision snapshots.
- First-class relationship records and focused React Flow visualisation.
- Timeline with exact/approximate fictional dates.
- Data-driven vertical city structure.
- Hard/strong/soft world rules engine.
- Questions and mysteries with explicit resolution flow.
- Advisory contradiction detection.
- Writing room kept separate from canon.
- AI context builder for Claude or ChatGPT; it does not call an external API.
- JSON backup/restore, Markdown export/import and named snapshots.
- PWA configuration and offline shell caching.
- Provenance for imported source documents.

## Data safety

Data is stored in browser IndexedDB, not on a server. Export a `.schism.json` backup before clearing browser data, changing browsers or moving computers.

## Important canon precedence

The bundled World Bible v1.0 overrides older contradictory material:

- Custodian is the origin of the Blight.
- The disaster is the Grey Hour.
- The ruling powers are the Concord Five.
- The immediate resource crisis is clean-water capacity.
- Node 04 contains the incident log, predictive Blight logic and roughly 40,000 neural scans.

## Limitations of this MVP

- Attachments store metadata only; binary attachment storage is a future migration.
- Contradiction detection currently includes structural and key technology-rule checks, not semantic AI analysis.
- The Markdown importer uses heading heuristics and deliberately marks uncertain classifications for review.
- The relationship layout is deterministic radial layout rather than a persisted manual canvas layout.
- AI provider integration is intentionally not enabled in-browser because API secrets must not be shipped to clients.

See `ARCHITECTURE.md` and `SCHEMA.md` for implementation details.
