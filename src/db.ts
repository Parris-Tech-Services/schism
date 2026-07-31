import Dexie, { type EntityTable } from 'dexie';
import type {
  CanonDecision, ConstraintRule, LoreEntry, ModuleType, Project, Relationship, Revision, Snapshot, SourceDocument, TimelineEvent, WorldQuestion, WritingNote,
  Campaign, Scene, GameState
} from './types';
import {
  seedDecisions, seedEntries, seedModuleTypes, seedProject, seedQuestions, seedRelationships, seedRules, seedSource, seedTimeline, seedWritingNotes
} from './data/seed';
import { campaignSeed, scenesSeed } from './data/campaignSeed';

export class SchismDatabase extends Dexie {
  projects!: EntityTable<Project, 'id'>;
  moduleTypes!: EntityTable<ModuleType, 'id'>;
  entries!: EntityTable<LoreEntry, 'id'>;
  relationships!: EntityTable<Relationship, 'id'>;
  timeline!: EntityTable<TimelineEvent, 'id'>;
  questions!: EntityTable<WorldQuestion, 'id'>;
  rules!: EntityTable<ConstraintRule, 'id'>;
  decisions!: EntityTable<CanonDecision, 'id'>;
  sources!: EntityTable<SourceDocument, 'id'>;
  writingNotes!: EntityTable<WritingNote, 'id'>;
  revisions!: EntityTable<Revision, 'id'>;
  snapshots!: EntityTable<Snapshot, 'id'>;
  campaigns!: EntityTable<Campaign, 'id'>;
  scenes!: EntityTable<Scene, 'id'>;
  saves!: EntityTable<GameState, 'id'>;

  constructor() {
    super('schism-codex');
    this.version(1).stores({
      projects: 'id, name, updatedAt',
      moduleTypes: 'id, name, updatedAt',
      entries: 'id, projectId, moduleTypeId, title, canonStatus, updatedAt, *tags, *aliases',
      relationships: 'id, projectId, sourceId, targetId, type, canonStatus, updatedAt',
      timeline: 'id, projectId, order, relativeYears, canonStatus, updatedAt',
      questions: 'id, projectId, status, updatedAt',
      rules: 'id, projectId, domain, severity, canonStatus, updatedAt',
      decisions: 'id, projectId, decisionDate, locked, updatedAt',
      sources: 'id, projectId, sourceType, authoritative, createdAt',
      writingNotes: 'id, projectId, kind, updatedAt',
      revisions: 'id, projectId, entryId, createdAt',
      snapshots: 'id, projectId, createdAt'
    });
    
    this.version(2).stores({
      campaigns: 'id, title, canonMode, updatedAt',
      scenes: 'id, campaignId',
      saves: 'id, campaignId, updatedAt'
    }).upgrade(() => {
      // safe upgrade path, Dexie creates tables automatically.
    });
  }
}

export const db = new SchismDatabase();

export async function initialiseDatabase(): Promise<void> {
  const count = await db.projects.count();
  if (count === 0) {
    let originalText = '';
    try {
      const response = await fetch('/seed/world-bible-v1.md');
      if (response.ok) originalText = await response.text();
    } catch {
      originalText = '# The Analog Schism\n\nAuthoritative seed file unavailable; structured fallback data loaded.';
    }
    await db.transaction('rw', [
      db.projects, db.moduleTypes, db.entries, db.relationships, db.timeline, db.questions, db.rules, db.decisions, db.sources, db.writingNotes
    ], async () => {
      await db.projects.add(seedProject);
      await db.moduleTypes.bulkAdd(seedModuleTypes);
      await db.entries.bulkAdd(seedEntries);
      await db.relationships.bulkAdd(seedRelationships);
      await db.timeline.bulkAdd(seedTimeline);
      await db.questions.bulkAdd(seedQuestions);
      await db.rules.bulkAdd(seedRules);
      await db.decisions.bulkAdd(seedDecisions);
      await db.sources.add({ ...seedSource, originalText });
      await db.writingNotes.bulkAdd(seedWritingNotes);
    });
  }

  // Idempotently seed campaigns
  const cCount = await db.campaigns.where('id').equals(campaignSeed.id).count();
  if (cCount === 0) {
    await db.transaction('rw', [db.campaigns, db.scenes], async () => {
      await db.campaigns.add(campaignSeed);
      await db.scenes.bulkAdd(scenesSeed);
    });
  }
}

export async function resetDatabase(): Promise<void> {
  await db.delete();
  await db.open();
  await initialiseDatabase();
}
