export type CanonStatus =
  | 'canon'
  | 'provisional'
  | 'draft'
  | 'disputed'
  | 'rumour'
  | 'secret'
  | 'superseded'
  | 'rejected';

export type FieldType =
  | 'short-text'
  | 'rich-text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'relative-date'
  | 'select'
  | 'multi-select'
  | 'tags'
  | 'entity'
  | 'entities'
  | 'url'
  | 'attachment'
  | 'status'
  | 'confidence'
  | 'key-value';

export interface ProjectSettings {
  presentDayLabel: string;
  dateTerminology: string;
  defaultCanonStatus: CanonStatus;
  theme: 'dark' | 'system';
  autosaveMs: number;
  showSpoilers: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  settings: ProjectSettings;
}

export interface FieldDefinition {
  id: string;
  name: string;
  key: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  helpText?: string;
}

export interface ModuleType {
  id: string;
  name: string;
  singular: string;
  plural: string;
  icon: string;
  description: string;
  colour: string;
  timelineEnabled: boolean;
  relationshipsEnabled: boolean;
  defaultFields: FieldDefinition[];
  createdAt: string;
  updatedAt: string;
}

export interface LoreEntry {
  id: string;
  projectId: string;
  moduleTypeId: string;
  title: string;
  summary: string;
  body: string;
  customFields: Record<string, unknown>;
  canonStatus: CanonStatus;
  confidence: number;
  tags: string[];
  aliases: string[];
  sourceIds: string[];
  image?: string;
  authorNotes?: string;
  locked?: boolean;
  spoilerLevel?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Relationship {
  id: string;
  projectId: string;
  sourceId: string;
  targetId: string;
  type: string;
  direction: 'directed' | 'undirected';
  description: string;
  startDate?: string;
  endDate?: string;
  canonStatus: CanonStatus;
  sourceIds: string[];
  spoilerLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  projectId: string;
  entryId?: string;
  title: string;
  description: string;
  order: number;
  dateLabel: string;
  relativeYears?: number;
  endDateLabel?: string;
  approximate: boolean;
  canonStatus: CanonStatus;
  relatedEntryIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorldQuestion {
  id: string;
  projectId: string;
  question: string;
  whyItMatters: string;
  clues: string[];
  possibleAnswers: string[];
  affectedEntryIds: string[];
  consequences: string;
  status: 'open' | 'investigating' | 'resolved' | 'parked';
  finalDecision?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConstraintRule {
  id: string;
  projectId: string;
  name: string;
  domain: string;
  rule: string;
  rationale: string;
  severity: 'hard' | 'strong' | 'soft';
  canonStatus: CanonStatus;
  examples: string[];
  exceptions: string[];
  relatedEntryIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CanonDecision {
  id: string;
  projectId: string;
  question: string;
  finalDecision: string;
  reasoning: string;
  alternatives: string[];
  consequences: string[];
  affectedEntryIds: string[];
  decisionDate: string;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SourceDocument {
  id: string;
  projectId: string;
  title: string;
  sourceType: 'world-bible' | 'user-note' | 'ai-suggestion' | 'conversation' | 'image' | 'research' | 'manuscript' | 'canon-decision';
  originalText: string;
  fileName?: string;
  authoritative: boolean;
  createdAt: string;
}

export interface WritingNote {
  id: string;
  projectId: string;
  title: string;
  kind: 'scene' | 'outline' | 'arc' | 'chapter' | 'dialogue' | 'note';
  body: string;
  relatedEntryIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Revision {
  id: string;
  projectId: string;
  entryId: string;
  snapshot: LoreEntry;
  reason: string;
  createdAt: string;
}

export interface Snapshot {
  id: string;
  projectId: string;
  name: string;
  payload: SchismExport;
  createdAt: string;
}

export interface SchismExport {
  schemaVersion: number;
  exportedAt: string;
  project: Project;
  moduleTypes: ModuleType[];
  entries: LoreEntry[];
  relationships: Relationship[];
  timeline: TimelineEvent[];
  questions: WorldQuestion[];
  rules: ConstraintRule[];
  decisions: CanonDecision[];
  sources: SourceDocument[];
  writingNotes: WritingNote[];
}

export interface ContradictionWarning {
  id: string;
  type: 'duplicate-title' | 'rule-conflict' | 'orphan' | 'missing-summary' | 'canon-collision' | 'circular-location';
  title: string;
  description: string;
  entryIds: string[];
  severity: 'high' | 'medium' | 'low';
}

export * from './types/story';
