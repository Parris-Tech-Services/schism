# Schism Codex Agent Instructions

## Project

Schism Codex is a local-first React and TypeScript worldbuilding application
for The Analog Schism.

Current stack:

- React
- TypeScript
- Vite
- Tailwind CSS
- Dexie / IndexedDB
- Zod
- React Router
- React Flow
- TipTap
- Vitest
- PWA support

Do not convert this project to Next.js or replace the existing architecture
without explicit approval.

## Canon authority

Canon source priority:

1. Canon Lock v1.1
2. The Analog Schism — World Bible v1.0
3. Later explicitly approved canon decisions
4. Approved Schism Codex records
5. All other material is draft or superseded

Never silently invent, rename, merge or overwrite canon.

Explicitly deprecated terms:

- Veyra
- ORISON
- Triune Board
- Night of Mirrors
- Floodline
- Vestrium
- Civic Score
- Dead Grid as a lowest physical layer

Current locked terms include:

- Custodian
- The Blight
- The Grey Hour
- Concord Five
- The Crown
- The Midstack
- The Works
- The Sub-Tiers
- scattered Dead Grid tribute zones
- Node 04
- clean-water capacity crisis
- Mara Venn
- Adrian Rook / Adrian Venn
- Priya Osei

Any proposed lore change must be shown separately and labelled as DRAFT.
It must not be inserted into canon seed data without explicit approval.

## Development rules

Before changing code:

1. Inspect the repository.
2. Explain the existing architecture.
3. Produce an implementation plan.
4. Wait for approval.

While changing code:

- Work only inside this repository.
- Never delete user documents or parent directories.
- Never run npm audit fix --force.
- Preserve existing data migrations.
- Preserve unknown imported fields.
- Use stable IDs rather than lore titles.
- Do not hard-code the current world categories.
- Keep new map records modular and data-driven.
- Run tests and the production build after changes.
- Report all failed tests honestly.
- Provide screenshots or browser verification for UI changes.

## Required verification

Run:

npm test
npm run build

Do not claim completion unless both commands have been attempted and their
actual results reported.
