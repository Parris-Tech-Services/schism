# Schism Codex portable schema v1

The full export extension is `.schism.json`.

Top-level keys:

- `schemaVersion`
- `exportedAt`
- `project`
- `moduleTypes`
- `entries`
- `relationships`
- `timeline`
- `questions`
- `rules`
- `decisions`
- `sources`
- `writingNotes`

## Stable identifiers

All references use stable IDs. Titles may change without breaking relationships.

## Canon states

- `canon`: certain and currently authoritative.
- `provisional`: current working answer, not locked.
- `draft`: an author proposal.
- `disputed`: multiple accounts exist in-world.
- `rumour`: unverified within the world.
- `secret`: certain to the author but hidden in-world.
- `superseded`: formerly canonical, retained for history.
- `rejected`: considered and explicitly excluded.

## Extensibility

Unknown keys inside `customFields` are preserved. New module types and field conventions can be added without modifying core entry tables. Schema migrations occur only when the portable top-level structure changes.

## Relationships

Relationships are records with source and target IDs, type, direction, description, dates, canon state, provenance and spoiler level. They are not embedded arrays on entries, preventing duplicated or inconsistent edges.
