import { describe, expect, it } from 'vitest';
import { migrateExport } from '../services/exportService';
import { seedProject } from '../data/seed';

function fixture(version = 1) {
  return { schemaVersion: version, exportedAt: new Date().toISOString(), project: seedProject, moduleTypes: [], entries: [], relationships: [], timeline: [], questions: [], rules: [], decisions: [], sources: [], writingNotes: [] };
}

describe('schema migration', () => {
  it('loads the current schema', () => expect(migrateExport(fixture()).schemaVersion).toBe(1));
  it('rejects a future schema', () => expect(() => migrateExport(fixture(99))).toThrow(/supports/));
});
