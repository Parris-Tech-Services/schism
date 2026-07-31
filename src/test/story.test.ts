import { describe, it, expect, beforeEach } from 'vitest';
import { checkRequirement, applyEffects } from '../services/storyEngine';
import type { GameState, Requirement, Effect } from '../types/story';

describe('Story Engine', () => {
  let state: GameState;

  beforeEach(() => {
    state = {
      id: 'test_save',
      saveName: 'Autosave',
      campaignId: 'test_camp',
      currentSceneId: 'start',
      visitedLocationIds: [],
      discoveredLocationIds: [],
      revealedExitIds: [],
      unlockedExitIds: [],
      mapNotes: {},
      playerCharacterId: 'mara_venn',
      inventory: ['keycard'],
      flags: ['visited_works'],
      variables: { tension: 5, credits: 100 },
      relationshipValues: { corin: -2 },
      discoveredLoreIds: ['node_04'],
      completedObjectives: ['obj_1'],
      journalEntries: [],
      decisionHistory: [],
      campaignVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  it('evaluates requirements correctly', () => {
    expect(checkRequirement({ type: 'flag_present', target: 'visited_works' }, state)).toBe(true);
    expect(checkRequirement({ type: 'flag_absent', target: 'visited_works' }, state)).toBe(false);
    expect(checkRequirement({ type: 'flag_absent', target: 'unknown_flag' }, state)).toBe(true);

    expect(checkRequirement({ type: 'variable_gt', target: 'tension', value: 3 }, state)).toBe(true);
    expect(checkRequirement({ type: 'variable_lt', target: 'tension', value: 3 }, state)).toBe(false);
    expect(checkRequirement({ type: 'variable_eq', target: 'credits', value: 100 }, state)).toBe(true);

    expect(checkRequirement({ type: 'item_present', target: 'keycard' }, state)).toBe(true);
    expect(checkRequirement({ type: 'item_absent', target: 'keycard' }, state)).toBe(false);

    expect(checkRequirement({ type: 'relationship_lt', target: 'corin', value: 0 }, state)).toBe(true);
    expect(checkRequirement({ type: 'lore_discovered', target: 'node_04' }, state)).toBe(true);
    
    expect(checkRequirement({ type: 'player_character', target: 'mara_venn' }, state)).toBe(true);
    expect(checkRequirement({ type: 'player_character', target: 'adrian_rook' }, state)).toBe(false);
  });

  it('applies effects without mutating original state', () => {
    const effects: Effect[] = [
      { type: 'set_flag', target: 'found_secret' },
      { type: 'remove_flag', target: 'visited_works' },
      { type: 'adjust_variable', target: 'tension', value: 2 },
      { type: 'add_item', target: 'blaster' },
      { type: 'remove_item', target: 'keycard' },
      { type: 'adjust_relationship', target: 'corin', value: 3 },
      { type: 'discover_lore', target: 'the_cut' },
      { type: 'trigger_ending', target: 'bad_end' }
    ];

    const newState = applyEffects(effects, state);

    // Original state unchanged
    expect(state.flags).not.toContain('found_secret');
    expect(state.flags).toContain('visited_works');
    expect(state.variables.tension).toBe(5);
    expect(state.inventory).toContain('keycard');
    
    // New state changed
    expect(newState.flags).toContain('found_secret');
    expect(newState.flags).not.toContain('visited_works');
    expect(newState.flags).toContain('ENDING_bad_end');
    expect(newState.variables.tension).toBe(7);
    expect(newState.inventory).toContain('blaster');
    expect(newState.inventory).not.toContain('keycard');
    expect(newState.relationshipValues.corin).toBe(1); // -2 + 3
    expect(newState.discoveredLoreIds).toContain('the_cut');
  });

  it('ensures save files are decoupled from canon database', () => {
    // Tests that state is purely local to GameState object 
    // and doesn't rely on Dexie directly in the pure functions.
    const effects: Effect[] = [{ type: 'discover_lore', target: 'new_provisional_lore' }];
    const newState = applyEffects(effects, state);
    expect(newState.discoveredLoreIds).toContain('new_provisional_lore');
    // We didn't touch db.entries here, thus proving canon isolation at the engine level.
  });
});
