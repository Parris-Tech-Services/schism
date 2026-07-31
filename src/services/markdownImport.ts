import type { LoreEntry, ModuleType } from '../types';
import { makeId } from '../lib/id';

export interface MarkdownImportResult {
  entries: LoreEntry[];
  report: { sections: number; created: number; needsReview: number };
}

const headingMap: Array<[RegExp, string]> = [
  [/blight|custodian|artificial intelligence/i, 'ai'],
  [/faction|weaver|breaker/i, 'faction'],
  [/corporate|concord/i, 'corporation'],
  [/node|technology|communications|implant|weapon|transport/i, 'technology'],
  [/city|crown|midstack|works|sub-tier|dead grid|outside|location/i, 'location'],
  [/history|timeline|grey hour/i, 'event'],
  [/resource|water|food|currency/i, 'resource'],
  [/belief|faith|culture|religion/i, 'belief'],
  [/government|law|crime|prison/i, 'law'],
  [/protagonist|character|citizen/i, 'character']
];

function classify(title: string, modules: ModuleType[]): { id: string; uncertain: boolean } {
  const match = headingMap.find(([pattern]) => pattern.test(title));
  if (match && modules.some((module) => module.id === match[1])) return { id: match[1], uncertain: false };
  return { id: modules[0]?.id ?? 'terminology', uncertain: true };
}

export function parseWorldBibleMarkdown(markdown: string, projectId: string, sourceId: string, modules: ModuleType[]): MarkdownImportResult {
  const parts = markdown.split(/^##\s+/gm).slice(1);
  const now = new Date().toISOString();
  let needsReview = 0;
  const entries = parts.map((part) => {
    const [headingLine, ...bodyLines] = part.split('\n');
    const rawTitle = headingLine.replace(/^\d+\.\s*/, '').trim();
    const bodyMarkdown = bodyLines.join('\n').replace(/^---\s*$/gm, '').trim();
    const plain = bodyMarkdown.replace(/[*_`#>-]/g, '').replace(/\s+/g, ' ').trim();
    const classification = classify(rawTitle, modules);
    if (classification.uncertain) needsReview += 1;
    return {
      id: makeId('entry'), projectId, moduleTypeId: classification.id, title: rawTitle,
      summary: plain.slice(0, 220), body: `<pre class="whitespace-pre-wrap">${escapeHtml(bodyMarkdown)}</pre>`, customFields: { importedHeading: rawTitle },
      canonStatus: classification.uncertain ? 'provisional' : 'canon', confidence: classification.uncertain ? 55 : 85,
      tags: ['markdown-import'], aliases: [], sourceIds: [sourceId], createdAt: now, updatedAt: now
    } satisfies LoreEntry;
  });
  return { entries, report: { sections: parts.length, created: entries.length, needsReview } };
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
