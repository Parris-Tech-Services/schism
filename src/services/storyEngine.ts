import type { GameState, Requirement, Effect, Choice, StoryExit, StoryInteractable, StoryInteraction } from '../types/story';

export function checkRequirement(req: Requirement, state: GameState): boolean {
  switch (req.type) {
    case 'flag_present':
      return state.flags.includes(req.target);
    case 'flag_absent':
      return !state.flags.includes(req.target);
    case 'variable_gt':
      return (state.variables[req.target] || 0) > (req.value || 0);
    case 'variable_lt':
      return (state.variables[req.target] || 0) < (req.value || 0);
    case 'variable_eq':
      return (state.variables[req.target] || 0) === (req.value || 0);
    case 'item_present':
      return state.inventory.includes(req.target);
    case 'item_absent':
      return !state.inventory.includes(req.target);
    case 'relationship_gt':
      return (state.relationshipValues[req.target] || 0) > (req.value || 0);
    case 'relationship_lt':
      return (state.relationshipValues[req.target] || 0) < (req.value || 0);
    case 'lore_discovered':
      return state.discoveredLoreIds.includes(req.target);
    case 'objective_completed':
      return state.completedObjectives.includes(req.target);
    case 'player_character':
      return state.playerCharacterId === req.target;
    default:
      return false;
  }
}

export function areRequirementsMet(requirements: Requirement[] | undefined, state: GameState): boolean {
  if (!requirements) return true;
  return requirements.every(req => checkRequirement(req, state));
}

export function applyEffect(effect: Effect, state: GameState): GameState {
  const newState = { ...state };
  
  switch (effect.type) {
    case 'set_flag':
      if (!newState.flags.includes(effect.target)) {
        newState.flags = [...newState.flags, effect.target];
      }
      break;
    case 'remove_flag':
      newState.flags = newState.flags.filter(f => f !== effect.target);
      break;
    case 'adjust_variable':
      newState.variables = { ...newState.variables, [effect.target]: (newState.variables[effect.target] || 0) + (effect.value || 0) };
      break;
    case 'set_variable':
      if (effect.text !== undefined) { // Store strings as flags/specials temporarily
         // For player_character assignment logic
         if (effect.target === 'player_character') newState.playerCharacterId = effect.text;
      } else {
         newState.variables = { ...newState.variables, [effect.target]: effect.value || 0 };
      }
      break;
    case 'add_item':
      if (!newState.inventory.includes(effect.target)) {
        newState.inventory = [...newState.inventory, effect.target];
      }
      break;
    case 'remove_item':
      newState.inventory = newState.inventory.filter(i => i !== effect.target);
      break;
    case 'adjust_relationship':
      newState.relationshipValues = { ...newState.relationshipValues, [effect.target]: (newState.relationshipValues[effect.target] || 0) + (effect.value || 0) };
      break;
    case 'discover_lore':
      if (!newState.discoveredLoreIds.includes(effect.target)) {
        newState.discoveredLoreIds = [...newState.discoveredLoreIds, effect.target];
      }
      break;
    case 'add_journal':
      if (effect.text) {
        newState.journalEntries = [...newState.journalEntries, {
          id: `j_${Date.now()}_${Math.random().toString(36).substring(2,9)}`,
          timestamp: new Date().toISOString(),
          text: effect.text
        }];
      }
      break;
    case 'complete_objective':
      if (!newState.completedObjectives.includes(effect.target)) {
        newState.completedObjectives = [...newState.completedObjectives, effect.target];
      }
      break;
    case 'trigger_ending':
      const endFlag = `ENDING_${effect.target}`;
      if (!newState.flags.includes(endFlag)) {
        newState.flags = [...newState.flags, endFlag];
      }
      break;
  }
  
  return newState;
}

export function applyEffects(effects: Effect[] | undefined, state: GameState): GameState {
  if (!effects) return state;
  let s = { ...state };
  for (const effect of effects) {
    s = applyEffect(effect, s);
  }
  return s;
}

export function getVisibleChoices(choices: Choice[], state: GameState): Choice[] {
  return choices.filter(choice => areRequirementsMet(choice.visibleWhen, state));
}

export function isChoiceEnabled(choice: Choice, state: GameState): boolean {
  return areRequirementsMet(choice.requirements, state);
}

export function attemptMovement(direction: string, currentLocationId: string, state: GameState, exits: StoryExit[]): { success: boolean, newLocationId?: string, message?: string, effects?: Effect[] } {
  const exit = exits.find(e => e.sourceLocationId === currentLocationId && e.direction === direction);
  if (!exit) return { success: false, message: "You cannot go that way." };
  
  if (exit.hidden && !state.revealedExitIds.includes(exit.id)) {
     return { success: false, message: "You cannot go that way." };
  }
  
  if (exit.locked && !state.unlockedExitIds.includes(exit.id)) {
     if (!areRequirementsMet(exit.requirements, state)) {
        return { success: false, message: "That route is blocked or locked." };
     }
  }

  return { success: true, newLocationId: exit.destinationLocationId, effects: exit.movementEffects };
}

export function resolveInteractable(targetStr: string, interactables: StoryInteractable[]): StoryInteractable | null {
  for (const item of interactables) {
    if (item.title.toLowerCase() === targetStr.toLowerCase() || (item.aliases || []).some(a => a.toLowerCase() === targetStr.toLowerCase())) {
      return item;
    }
  }
  return null;
}
