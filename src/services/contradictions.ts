import type { ConstraintRule, ContradictionWarning, LoreEntry, Relationship } from '../types';
import { stripHtml } from '../lib/text';

export function detectContradictions(entries: LoreEntry[], relationships: Relationship[], rules: ConstraintRule[]): ContradictionWarning[] {
  const warnings: ContradictionWarning[] = [];
  const byTitle = new Map<string, LoreEntry[]>();
  for (const entry of entries) {
    const key = entry.title.trim().toLowerCase();
    byTitle.set(key, [...(byTitle.get(key) ?? []), entry]);
    if (!entry.summary.trim()) warnings.push({ id: `summary_${entry.id}`, type: 'missing-summary', title: `Missing summary: ${entry.title}`, description: 'This entry is harder to search and understand without a concise summary.', entryIds: [entry.id], severity: 'low' });
  }
  for (const [title, group] of byTitle) {
    const current = group.filter((entry) => ['canon', 'secret', 'provisional'].includes(entry.canonStatus));
    if (current.length > 1) warnings.push({ id: `duplicate_${title}`, type: 'duplicate-title', title: `Possible duplicate: ${group[0].title}`, description: `${current.length} current records share this title. Merge them or mark them as intentional accounts.`, entryIds: current.map((entry) => entry.id), severity: 'medium' });
  }
  const related = new Set<string>();
  for (const relationship of relationships) {
    related.add(relationship.sourceId); related.add(relationship.targetId);
  }
  for (const entry of entries.filter((item) => !related.has(item.id))) {
    warnings.push({ id: `orphan_${entry.id}`, type: 'orphan', title: `Unconnected entry: ${entry.title}`, description: 'This entry has no first-class relationships yet.', entryIds: [entry.id], severity: 'low' });
  }
  const hardRules = rules.filter((rule) => rule.severity === 'hard' && rule.canonStatus === 'canon');
  for (const entry of entries.filter((item) => ['canon', 'provisional'].includes(item.canonStatus))) {
    const text = `${entry.title} ${entry.summary} ${stripHtml(entry.body)}`.toLowerCase();
    if (text.includes('kill the mainframe') || text.includes('single blight core')) {
      const rule = hardRules.find((item) => item.name === 'No central Blight core');
      if (rule) warnings.push({ id: `rule_core_${entry.id}`, type: 'rule-conflict', title: `Technology-rule conflict: ${entry.title}`, description: `This may violate “${rule.name}”.`, entryIds: [entry.id], severity: 'high' });
    }
    if ((text.includes('wireless') && text.includes('completely safe')) || text.includes('unhackable wireless')) {
      const rule = hardRules.find((item) => item.name === 'Wireless exposure is unsafe');
      if (rule) warnings.push({ id: `rule_wireless_${entry.id}`, type: 'rule-conflict', title: `Wireless-rule conflict: ${entry.title}`, description: `This may violate “${rule.name}”.`, entryIds: [entry.id], severity: 'high' });
    }
  }
  return warnings;
}

export function validateRelationship(relationship: Pick<Relationship, 'sourceId' | 'targetId'>): string | null {
  if (!relationship.sourceId || !relationship.targetId) return 'Both entries are required.';
  if (relationship.sourceId === relationship.targetId) return 'An entry cannot relate to itself.';
  return null;
}
