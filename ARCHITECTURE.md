# Architecture

## Chosen stack

- **React + TypeScript + Vite** for a fast, maintainable local application.
- **Tailwind CSS** for a consistent industrial/CRT visual system.
- **Dexie / IndexedDB** for offline persistence without an account or server.
- **Zod** for versioned import validation.
- **React Router** for stable screen and entry URLs.
- **React Flow** for relationship visualisation.
- **TipTap** for extensible rich-text editing.
- **Vitest** for critical data-logic tests.
- **vite-plugin-pwa** for installability and offline application-shell caching.

## Why IndexedDB rather than a graph database

For a single-user offline-first MVP, IndexedDB avoids installation and synchronisation complexity. Relationships are still first-class records, so the data model can later move to PostgreSQL, SurrealDB or Neo4j without flattening the graph.

A hosted multi-user version would use:

- PostgreSQL for authoritative records, revisions and permissions.
- `entries` and `relationships` tables with JSONB custom fields.
- Optional Neo4j projection for high-volume graph traversal.
- Object storage for attachments.
- Server-side provider adapters for OpenAI/Claude keys.

## Data flow

1. `initialiseDatabase()` checks for an existing project.
2. On first launch it loads the original Markdown source and structured seed records.
3. Screens subscribe through `useLiveQuery`, so Dexie writes update the UI automatically.
4. Lore editing creates revision snapshots before replacing existing records.
5. Export builds a versioned portable object validated by Zod on restore.
6. AI Context Builder performs local selection and prompt construction only.

## Modularity

`ModuleType` records define categories at runtime. `LoreEntry.moduleTypeId` points to these records and `customFields` preserves category-specific values. New categories therefore do not require database migrations.

## Future server boundary

The present app has no secrets or network requirement. A future `server/ai` boundary should accept selected context, call a configured provider, return a change proposal and require explicit user approval before any database mutation.
