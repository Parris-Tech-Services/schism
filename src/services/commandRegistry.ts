export interface CommandDefinition {
  id: string;
  canonicalName: string;
  aliases: string[];
  category: 'navigation' | 'observation' | 'interaction' | 'character' | 'system' | 'info';
  description: string;
  mutatesState: boolean;
}

export const COMMAND_REGISTRY: CommandDefinition[] = [
  // Navigation
  { id: 'go_north', canonicalName: 'north', aliases: ['n', 'go north', 'walk north'], category: 'navigation', description: 'Move north.', mutatesState: true },
  { id: 'go_south', canonicalName: 'south', aliases: ['s', 'go south', 'walk south'], category: 'navigation', description: 'Move south.', mutatesState: true },
  { id: 'go_east', canonicalName: 'east', aliases: ['e', 'go east', 'walk east'], category: 'navigation', description: 'Move east.', mutatesState: true },
  { id: 'go_west', canonicalName: 'west', aliases: ['w', 'go west', 'walk west'], category: 'navigation', description: 'Move west.', mutatesState: true },
  { id: 'go_up', canonicalName: 'up', aliases: ['u', 'climb up', 'go up'], category: 'navigation', description: 'Move up.', mutatesState: true },
  { id: 'go_down', canonicalName: 'down', aliases: ['d', 'descend', 'go down'], category: 'navigation', description: 'Move down.', mutatesState: true },
  { id: 'go_back', canonicalName: 'back', aliases: ['go back', 'return'], category: 'navigation', description: 'Return to the previous location.', mutatesState: true },
  { id: 'exits', canonicalName: 'exits', aliases: ['routes', 'where'], category: 'navigation', description: 'List available exits.', mutatesState: false },
  { id: 'map', canonicalName: 'map', aliases: ['map local'], category: 'navigation', description: 'Show the local map.', mutatesState: false },
  { id: 'map_region', canonicalName: 'map region', aliases: ['region map'], category: 'navigation', description: 'Show the regional map.', mutatesState: false },
  { id: 'map_city', canonicalName: 'map city', aliases: ['city map'], category: 'navigation', description: 'Show the city schematic.', mutatesState: false },

  // Observation
  { id: 'look', canonicalName: 'look', aliases: ['l', 'look around'], category: 'observation', description: 'Look around the current location.', mutatesState: false },
  { id: 'examine', canonicalName: 'examine', aliases: ['x', 'look at', 'inspect'], category: 'observation', description: 'Examine an object.', mutatesState: false },
  { id: 'search', canonicalName: 'search', aliases: [], category: 'observation', description: 'Search the area or an object.', mutatesState: false },
  { id: 'read', canonicalName: 'read', aliases: [], category: 'observation', description: 'Read a document or terminal.', mutatesState: false },
  { id: 'listen', canonicalName: 'listen', aliases: ['listen to'], category: 'observation', description: 'Listen to the surroundings.', mutatesState: false },

  // Info
  { id: 'inventory', canonicalName: 'inventory', aliases: ['inv', 'i', 'equipment'], category: 'info', description: 'Check your inventory.', mutatesState: false },
  { id: 'objectives', canonicalName: 'objectives', aliases: ['objective', 'obj', 'o'], category: 'info', description: 'Check your objectives.', mutatesState: false },
  { id: 'journal', canonicalName: 'journal', aliases: ['j'], category: 'info', description: 'Read your journal.', mutatesState: false },
  { id: 'status', canonicalName: 'status', aliases: ['stats'], category: 'info', description: 'Check your status.', mutatesState: false },
  { id: 'codex', canonicalName: 'codex', aliases: ['lore', 'clues'], category: 'info', description: 'Review discovered lore.', mutatesState: false },

  // System
  { id: 'help', canonicalName: 'help', aliases: ['?', 'commands'], category: 'system', description: 'Show available commands.', mutatesState: false },
  { id: 'save', canonicalName: 'save', aliases: [], category: 'system', description: 'Save your game.', mutatesState: false },
  { id: 'load', canonicalName: 'load', aliases: [], category: 'system', description: 'Load a saved game.', mutatesState: false },
  { id: 'restart', canonicalName: 'restart', aliases: ['restart chapter'], category: 'system', description: 'Restart the current chapter.', mutatesState: false },
  { id: 'clear', canonicalName: 'clear', aliases: [], category: 'system', description: 'Clear the terminal output.', mutatesState: false },
];

export function resolveVerb(verb: string): CommandDefinition | null {
  for (const cmd of COMMAND_REGISTRY) {
    if (cmd.canonicalName === verb || cmd.aliases.includes(verb)) {
      return cmd;
    }
  }
  return null;
}
