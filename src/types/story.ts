import { z } from 'zod';

export type CanonMode = 'canon_adaptation' | 'alternate_continuity' | 'sandbox';

export const RequirementSchema = z.object({
  type: z.enum(['flag_present', 'flag_absent', 'variable_gt', 'variable_lt', 'variable_eq', 'item_present', 'item_absent', 'relationship_gt', 'relationship_lt', 'lore_discovered', 'objective_completed', 'player_character']),
  target: z.string(),
  value: z.number().optional(),
  characterId: z.string().optional()
});
export type Requirement = z.infer<typeof RequirementSchema>;

export const EffectSchema = z.object({
  type: z.enum(['set_flag', 'remove_flag', 'adjust_variable', 'set_variable', 'add_item', 'remove_item', 'adjust_relationship', 'discover_lore', 'add_journal', 'complete_objective', 'trigger_ending']),
  target: z.string(),
  value: z.number().optional(),
  text: z.string().optional()
});
export type Effect = z.infer<typeof EffectSchema>;

export const ChoiceSchema = z.object({
  id: z.string(),
  label: z.string(),
  destinationSceneId: z.string().optional(),
  requirements: z.array(RequirementSchema).optional(),
  effects: z.array(EffectSchema).optional(),
  visibleWhen: z.array(RequirementSchema).optional(),
  disabledReason: z.string().optional(),
  moralTags: z.array(z.string()).optional(),
  consequencePreview: z.string().optional()
});
export type Choice = z.infer<typeof ChoiceSchema>;

export const SceneSchema = z.object({
  id: z.string(),
  campaignId: z.string(),
  title: z.string(),
  locationEntryId: z.string().optional(),
  narratorText: z.string(),
  availableCharacterIds: z.array(z.string()).optional(),
  entryEffects: z.array(EffectSchema).optional(),
  choices: z.array(ChoiceSchema).default([]),
  commandResponses: z.record(z.string(), z.string()).optional(),
  discoveredLoreIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
});
export type Scene = z.infer<typeof SceneSchema>;

export const CampaignSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  startingSceneId: z.string(),
  version: z.number(),
  canonMode: z.enum(['canon_adaptation', 'alternate_continuity', 'sandbox']),
  characterOptions: z.array(z.object({
    id: z.string(),
    loreEntryId: z.string(),
    name: z.string(),
    description: z.string()
  })),
  variables: z.record(z.string(), z.number()).default({}),
  endings: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    isCanon: z.boolean()
  })).default([]),
  createdAt: z.string(),
  updatedAt: z.string()
});
export type Campaign = z.infer<typeof CampaignSchema>;

export const GameStateSchema = z.object({
  id: z.string(),
  saveName: z.string().default('Autosave'),
  campaignId: z.string(),
  currentSceneId: z.string(),
  playerCharacterId: z.string(),
  inventory: z.array(z.string()).default([]),
  flags: z.array(z.string()).default([]),
  variables: z.record(z.string(), z.number()).default({}),
  relationshipValues: z.record(z.string(), z.number()).default({}),
  discoveredLoreIds: z.array(z.string()).default([]),
  completedObjectives: z.array(z.string()).default([]),
  journalEntries: z.array(z.object({
    id: z.string(),
    timestamp: z.string(),
    text: z.string()
  })).default([]),
  decisionHistory: z.array(z.string()).default([]),
  campaignVersion: z.number(),
  createdAt: z.string(),
  updatedAt: z.string()
});
export type GameState = z.infer<typeof GameStateSchema>;
