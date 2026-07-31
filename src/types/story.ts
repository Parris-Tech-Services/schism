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

export const StoryMapSchema = z.object({
  id: z.string(),
  campaignId: z.string(),
  title: z.string(),
  description: z.string(),
  regionType: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  floor: z.string().optional(),
  canonScope: z.string(),
  version: z.number().optional()
});
export type StoryMap = z.infer<typeof StoryMapSchema>;

export const StoryLocationSchema = z.object({
  id: z.string(),
  mapId: z.string(),
  campaignId: z.string(),
  title: z.string(),
  shortLabel: z.string().optional(),
  description: z.string(),
  x: z.number(),
  y: z.number(),
  z: z.number().optional(),
  linkedLoreEntryId: z.string().optional(),
  entrySceneId: z.string().optional(),
  icon: z.string().optional(),
  hazardType: z.string().optional(),
  canonScope: z.string(),
  initiallyDiscovered: z.boolean().optional(),
  initiallyVisited: z.boolean().optional()
});
export type StoryLocation = z.infer<typeof StoryLocationSchema>;

export const StoryExitSchema = z.object({
  id: z.string(),
  mapId: z.string(),
  sourceLocationId: z.string(),
  destinationLocationId: z.string(),
  direction: z.string(),
  reverseDirection: z.string().optional(),
  label: z.string().optional(),
  hidden: z.boolean().optional(),
  locked: z.boolean().optional(),
  requirements: z.array(RequirementSchema).optional(),
  movementEffects: z.array(EffectSchema).optional(),
  canonScope: z.string()
});
export type StoryExit = z.infer<typeof StoryExitSchema>;

export const StoryInteractionSchema = z.object({
  verb: z.string(),
  directObjectId: z.string(),
  indirectObjectId: z.string().optional(),
  requirements: z.array(RequirementSchema).optional(),
  successText: z.string().optional(),
  failureText: z.string().optional(),
  effects: z.array(EffectSchema).optional(),
  repeatBehaviour: z.string().optional(),
  onceOnly: z.boolean().optional()
});
export type StoryInteraction = z.infer<typeof StoryInteractionSchema>;

export const StoryInteractableSchema = z.object({
  id: z.string(),
  locationId: z.string(),
  title: z.string(),
  aliases: z.array(z.string()).optional(),
  description: z.string(),
  hidden: z.boolean().optional(),
  discovered: z.boolean().optional(),
  portable: z.boolean().optional(),
  inventoryItemId: z.string().optional(),
  availableVerbs: z.array(z.string()).optional(),
  requirements: z.array(RequirementSchema).optional(),
  interactions: z.array(StoryInteractionSchema).optional(),
  canonScope: z.string()
});
export type StoryInteractable = z.infer<typeof StoryInteractableSchema>;

export const GameStateSchema = z.object({
  id: z.string(),
  saveName: z.string().default('Autosave'),
  campaignId: z.string(),
  currentSceneId: z.string(),
  currentMapId: z.string().optional(),
  currentLocationId: z.string().optional(),
  visitedLocationIds: z.array(z.string()).default([]),
  discoveredLocationIds: z.array(z.string()).default([]),
  revealedExitIds: z.array(z.string()).default([]),
  unlockedExitIds: z.array(z.string()).default([]),
  mapNotes: z.record(z.string(), z.string()).default({}),
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
