import { z } from 'zod';

export const canonStatusSchema = z.enum([
  'canon', 'provisional', 'draft', 'disputed', 'rumour', 'secret', 'superseded', 'rejected'
]);

const fieldDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  key: z.string(),
  type: z.string(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  helpText: z.string().optional()
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  schemaVersion: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  settings: z.object({
    presentDayLabel: z.string(),
    dateTerminology: z.string(),
    defaultCanonStatus: canonStatusSchema,
    theme: z.enum(['dark', 'system']),
    autosaveMs: z.number(),
    showSpoilers: z.boolean()
  })
});

export const moduleTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  singular: z.string(),
  plural: z.string(),
  icon: z.string(),
  description: z.string(),
  colour: z.string(),
  timelineEnabled: z.boolean(),
  relationshipsEnabled: z.boolean(),
  defaultFields: z.array(fieldDefinitionSchema),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const loreEntrySchema = z.object({
  id: z.string(), projectId: z.string(), moduleTypeId: z.string(), title: z.string(), summary: z.string(), body: z.string(),
  customFields: z.record(z.unknown()), canonStatus: canonStatusSchema, confidence: z.number(), tags: z.array(z.string()), aliases: z.array(z.string()),
  sourceIds: z.array(z.string()), image: z.string().optional(), authorNotes: z.string().optional(), locked: z.boolean().optional(), spoilerLevel: z.number().optional(),
  createdAt: z.string(), updatedAt: z.string()
});

export const relationshipSchema = z.object({
  id: z.string(), projectId: z.string(), sourceId: z.string(), targetId: z.string(), type: z.string(),
  direction: z.enum(['directed', 'undirected']), description: z.string(), startDate: z.string().optional(), endDate: z.string().optional(),
  canonStatus: canonStatusSchema, sourceIds: z.array(z.string()), spoilerLevel: z.number(), createdAt: z.string(), updatedAt: z.string()
});

export const schismExportSchema = z.object({
  schemaVersion: z.number(),
  exportedAt: z.string(),
  project: projectSchema,
  moduleTypes: z.array(moduleTypeSchema),
  entries: z.array(loreEntrySchema),
  relationships: z.array(relationshipSchema),
  timeline: z.array(z.any()),
  questions: z.array(z.any()),
  rules: z.array(z.any()),
  decisions: z.array(z.any()),
  sources: z.array(z.any()),
  writingNotes: z.array(z.any())
});
