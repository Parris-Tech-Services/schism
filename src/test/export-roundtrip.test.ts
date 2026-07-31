import { beforeEach, describe, expect, it } from 'vitest';
import { db, initialiseDatabase } from '../db';
import { buildExport, restoreExport } from '../services/exportService';

describe('export and restore', () => {
  beforeEach(async () => { await db.delete(); await db.open(); await initialiseDatabase(); });
  it('round-trips core records', async () => {
    const exported = await buildExport();
    await db.entries.clear();
    await restoreExport(exported);
    expect(await db.entries.get('node_04')).toBeTruthy();
    expect((await db.entries.toArray()).length).toBe(exported.entries.length);
  });
});
