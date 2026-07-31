import { db } from '../db';
import { schismExportSchema } from '../lib/schemas';
import type { SchismExport } from '../types';

export const CURRENT_SCHEMA_VERSION = 1;

export async function buildExport(): Promise<SchismExport> {
  const project = await db.projects.toCollection().first();
  if (!project) throw new Error('No project found.');
  const [moduleTypes, entries, relationships, timeline, questions, rules, decisions, sources, writingNotes] = await Promise.all([
    db.moduleTypes.toArray(), db.entries.toArray(), db.relationships.toArray(), db.timeline.toArray(), db.questions.toArray(),
    db.rules.toArray(), db.decisions.toArray(), db.sources.toArray(), db.writingNotes.toArray()
  ]);
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    project,
    moduleTypes,
    entries,
    relationships,
    timeline,
    questions,
    rules,
    decisions,
    sources,
    writingNotes
  };
}

export function migrateExport(input: unknown): SchismExport {
  const parsed = schismExportSchema.parse(input);
  if (parsed.schemaVersion > CURRENT_SCHEMA_VERSION) {
    throw new Error(`This backup uses schema version ${parsed.schemaVersion}; this app supports ${CURRENT_SCHEMA_VERSION}.`);
  }
  return parsed as SchismExport;
}

export async function restoreExport(input: unknown): Promise<void> {
  const data = migrateExport(input);
  await db.transaction('rw', [
    db.projects, db.moduleTypes, db.entries, db.relationships, db.timeline, db.questions, db.rules, db.decisions, db.sources, db.writingNotes
  ], async () => {
    await Promise.all([
      db.projects.clear(), db.moduleTypes.clear(), db.entries.clear(), db.relationships.clear(), db.timeline.clear(), db.questions.clear(),
      db.rules.clear(), db.decisions.clear(), db.sources.clear(), db.writingNotes.clear()
    ]);
    await db.projects.add(data.project);
    await db.moduleTypes.bulkAdd(data.moduleTypes);
    await db.entries.bulkAdd(data.entries);
    await db.relationships.bulkAdd(data.relationships);
    await db.timeline.bulkAdd(data.timeline);
    await db.questions.bulkAdd(data.questions);
    await db.rules.bulkAdd(data.rules);
    await db.decisions.bulkAdd(data.decisions);
    await db.sources.bulkAdd(data.sources);
    await db.writingNotes.bulkAdd(data.writingNotes);
  });
}

export function exportToMarkdown(data: SchismExport, includeNonCanon = false): string {
  const modules = new Map(data.moduleTypes.map((module) => [module.id, module]));
  const entries = data.entries
    .filter((entry) => includeNonCanon || ['canon', 'secret', 'disputed'].includes(entry.canonStatus))
    .sort((a, b) => (modules.get(a.moduleTypeId)?.name ?? '').localeCompare(modules.get(b.moduleTypeId)?.name ?? '') || a.title.localeCompare(b.title));
  const grouped = new Map<string, typeof entries>();
  for (const entry of entries) {
    const label = modules.get(entry.moduleTypeId)?.plural ?? 'Lore';
    const list = grouped.get(label) ?? [];
    list.push(entry);
    grouped.set(label, list);
  }
  const lines = [`# ${data.project.name}`, '', data.project.description, '', `> Exported ${new Date(data.exportedAt).toLocaleString()}`, ''];
  for (const [label, group] of grouped) {
    lines.push(`## ${label}`, '');
    for (const item of group) {
      const plainBody = item.body.replace(/<\/?(?:p|div|h\d|ul|ol|li|blockquote|strong|em|br)[^>]*>/gi, (tag) => {
        if (/strong/i.test(tag)) return tag.startsWith('</') ? '**' : '**';
        if (/em/i.test(tag)) return tag.startsWith('</') ? '*' : '*';
        if (/li/i.test(tag) && !tag.startsWith('</')) return '- ';
        return tag.startsWith('</p') || /<br/i.test(tag) ? '\n' : '';
      }).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();
      lines.push(`### ${item.title}`, '', `**Status:** ${item.canonStatus}`, '', item.summary, '', plainBody, '');
    }
  }
  return lines.join('\n');
}
