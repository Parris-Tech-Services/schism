import type { StoryMap, StoryLocation, StoryExit, StoryInteractable } from '../types/story';

export const storyMapsSeed: StoryMap[] = [
  {
    id: 'map_mara_node04',
    campaignId: 'echoes_of_node_04',
    title: 'Eastern Works Boundary',
    description: 'The industrial edge leading toward Node 04.',
    regionType: 'local',
    canonScope: 'canon_adaptation'
  },
  {
    id: 'map_adrian_halcyon',
    campaignId: 'echoes_of_node_04',
    title: 'Halcyon Operations',
    description: 'Restricted Halcyon preparation zones.',
    regionType: 'local',
    canonScope: 'interactive_continuity'
  },
  {
    id: 'map_priya_clinic',
    campaignId: 'echoes_of_node_04',
    title: 'Midstack Clinic',
    description: 'Water-dependent treatment facility.',
    regionType: 'local',
    canonScope: 'interactive_continuity'
  }
];

export const storyLocationsSeed: StoryLocation[] = [
  // Mara's Route Locations
  {
    id: 'loc_m1_perimeter',
    mapId: 'map_mara_node04',
    campaignId: 'echoes_of_node_04',
    title: 'Perimeter Access',
    shortLabel: 'Perimeter',
    description: 'A rusting catwalk overlooking the depths of the Works.',
    x: 0, y: 0,
    canonScope: 'interactive_continuity',
    initiallyDiscovered: true,
    initiallyVisited: true
  },
  {
    id: 'loc_m2_junction',
    mapId: 'map_mara_node04',
    campaignId: 'echoes_of_node_04',
    title: 'Maintenance Junction',
    shortLabel: 'Junction',
    description: 'A crossroads of thick, pulsing cables.',
    x: 0, y: 1,
    canonScope: 'interactive_continuity',
    initiallyDiscovered: true
  },
  {
    id: 'loc_m3_cable',
    mapId: 'map_mara_node04',
    campaignId: 'echoes_of_node_04',
    title: 'Cable Approach',
    shortLabel: 'Cable',
    description: 'A cramped service tunnel lined with active data feeds.',
    x: 1, y: 1,
    canonScope: 'interactive_continuity'
  },
  {
    id: 'loc_m4_relay',
    mapId: 'map_mara_node04',
    campaignId: 'echoes_of_node_04',
    title: 'Relay Chamber',
    shortLabel: 'Relay',
    description: 'Node 04 is directly below. An old analogue relay sits here.',
    x: 1, y: 2,
    canonScope: 'interactive_continuity',
    entrySceneId: 'mara_start' // Connects to the narrative start
  },
  {
    id: 'loc_m5_archive',
    mapId: 'map_mara_node04',
    campaignId: 'echoes_of_node_04',
    title: 'Archive Interface',
    shortLabel: 'Archive',
    description: 'The core terminal housing the dormant continuations.',
    x: 1, y: 3,
    canonScope: 'canon_adaptation'
  },
  {
    id: 'loc_m6_service',
    mapId: 'map_mara_node04',
    campaignId: 'echoes_of_node_04',
    title: 'Concealed Service Route',
    shortLabel: 'Service Route',
    description: 'A hidden, crumbling passage bypassing the main sensors.',
    x: -1, y: 1,
    canonScope: 'interactive_continuity'
  },

  // Adrian's Route Locations
  {
    id: 'loc_a1_prep',
    mapId: 'map_adrian_halcyon',
    campaignId: 'echoes_of_node_04',
    title: 'Equipment Preparation',
    shortLabel: 'Prep Area',
    description: 'Sterile racks of tactical gear.',
    x: 0, y: 0,
    canonScope: 'interactive_continuity',
    initiallyDiscovered: true,
    initiallyVisited: true
  },
  {
    id: 'loc_a2_corridor',
    mapId: 'map_adrian_halcyon',
    campaignId: 'echoes_of_node_04',
    title: 'Operations Corridor',
    shortLabel: 'Corridor',
    description: 'A pristine hallway patrolled by automated sentries.',
    x: 1, y: 0,
    canonScope: 'interactive_continuity',
    initiallyDiscovered: true
  },
  {
    id: 'loc_a3_briefing',
    mapId: 'map_adrian_halcyon',
    campaignId: 'echoes_of_node_04',
    title: 'Briefing Chamber',
    shortLabel: 'Briefing',
    description: 'A stark room with holographic tactical displays.',
    x: 1, y: 1,
    canonScope: 'canon_adaptation',
    entrySceneId: 'adrian_start'
  },
  {
    id: 'loc_a4_records',
    mapId: 'map_adrian_halcyon',
    campaignId: 'echoes_of_node_04',
    title: 'Restricted Records Access',
    shortLabel: 'Records',
    description: 'Secure terminal access to Halcyon structural intelligence.',
    x: 2, y: 1,
    canonScope: 'interactive_continuity'
  },
  {
    id: 'loc_a5_transit',
    mapId: 'map_adrian_halcyon',
    campaignId: 'echoes_of_node_04',
    title: 'Vertical Transit Checkpoint',
    shortLabel: 'Transit',
    description: 'The elevator bank leading down to the Works.',
    x: 1, y: -1,
    canonScope: 'interactive_continuity'
  },

  // Priya's Route Locations
  {
    id: 'loc_p1_intake',
    mapId: 'map_priya_clinic',
    campaignId: 'echoes_of_node_04',
    title: 'Intake Station',
    shortLabel: 'Intake',
    description: 'The crowded front desk of the clinic.',
    x: 0, y: 0,
    canonScope: 'interactive_continuity',
    initiallyDiscovered: true,
    initiallyVisited: true
  },
  {
    id: 'loc_p2_admin',
    mapId: 'map_priya_clinic',
    campaignId: 'echoes_of_node_04',
    title: 'Staff Administration',
    shortLabel: 'Admin',
    description: 'The cramped office where Priya reviews algorithm outputs.',
    x: -1, y: 0,
    canonScope: 'interactive_continuity',
    initiallyDiscovered: true,
    entrySceneId: 'priya_start'
  },
  {
    id: 'loc_p3_treatment',
    mapId: 'map_priya_clinic',
    campaignId: 'echoes_of_node_04',
    title: 'Treatment Bay',
    shortLabel: 'Treatment',
    description: 'Makeshift beds filled with critical patients.',
    x: 0, y: 1,
    canonScope: 'interactive_continuity'
  },
  {
    id: 'loc_p4_water',
    mapId: 'map_priya_clinic',
    campaignId: 'echoes_of_node_04',
    title: 'Water-dependent Procedure Room',
    shortLabel: 'Procedure Rm',
    description: 'A sterile room requiring vast clean water allocations.',
    x: 1, y: 1,
    canonScope: 'interactive_continuity'
  },
  {
    id: 'loc_p5_supply',
    mapId: 'map_priya_clinic',
    campaignId: 'echoes_of_node_04',
    title: 'Supply Cabinet',
    shortLabel: 'Supplies',
    description: 'A locked storage area for rare medical reserves.',
    x: -1, y: 1,
    canonScope: 'interactive_continuity'
  }
];

export const storyExitsSeed: StoryExit[] = [
  // Mara Exits
  { id: 'ex_m1_m2', mapId: 'map_mara_node04', sourceLocationId: 'loc_m1_perimeter', destinationLocationId: 'loc_m2_junction', direction: 'south', reverseDirection: 'north', canonScope: 'interactive_continuity' },
  { id: 'ex_m2_m1', mapId: 'map_mara_node04', sourceLocationId: 'loc_m2_junction', destinationLocationId: 'loc_m1_perimeter', direction: 'north', reverseDirection: 'south', canonScope: 'interactive_continuity' },
  { id: 'ex_m2_m3', mapId: 'map_mara_node04', sourceLocationId: 'loc_m2_junction', destinationLocationId: 'loc_m3_cable', direction: 'east', reverseDirection: 'west', canonScope: 'interactive_continuity' },
  { id: 'ex_m3_m2', mapId: 'map_mara_node04', sourceLocationId: 'loc_m3_cable', destinationLocationId: 'loc_m2_junction', direction: 'west', reverseDirection: 'east', canonScope: 'interactive_continuity' },
  { id: 'ex_m3_m4', mapId: 'map_mara_node04', sourceLocationId: 'loc_m3_cable', destinationLocationId: 'loc_m4_relay', direction: 'south', reverseDirection: 'north', canonScope: 'interactive_continuity' },
  { id: 'ex_m4_m3', mapId: 'map_mara_node04', sourceLocationId: 'loc_m4_relay', destinationLocationId: 'loc_m3_cable', direction: 'north', reverseDirection: 'south', canonScope: 'interactive_continuity' },
  { id: 'ex_m4_m5', mapId: 'map_mara_node04', sourceLocationId: 'loc_m4_relay', destinationLocationId: 'loc_m5_archive', direction: 'south', reverseDirection: 'north', locked: true, requirements: [{ type: 'flag_present', target: 'mara_unlocked_archive' }], canonScope: 'interactive_continuity' },
  { id: 'ex_m5_m4', mapId: 'map_mara_node04', sourceLocationId: 'loc_m5_archive', destinationLocationId: 'loc_m4_relay', direction: 'north', reverseDirection: 'south', canonScope: 'interactive_continuity' },
  { id: 'ex_m2_m6', mapId: 'map_mara_node04', sourceLocationId: 'loc_m2_junction', destinationLocationId: 'loc_m6_service', direction: 'west', reverseDirection: 'east', hidden: true, canonScope: 'interactive_continuity' },
  { id: 'ex_m6_m2', mapId: 'map_mara_node04', sourceLocationId: 'loc_m6_service', destinationLocationId: 'loc_m2_junction', direction: 'east', reverseDirection: 'west', canonScope: 'interactive_continuity' },

  // Adrian Exits
  { id: 'ex_a1_a2', mapId: 'map_adrian_halcyon', sourceLocationId: 'loc_a1_prep', destinationLocationId: 'loc_a2_corridor', direction: 'east', reverseDirection: 'west', canonScope: 'interactive_continuity' },
  { id: 'ex_a2_a1', mapId: 'map_adrian_halcyon', sourceLocationId: 'loc_a2_corridor', destinationLocationId: 'loc_a1_prep', direction: 'west', reverseDirection: 'east', canonScope: 'interactive_continuity' },
  { id: 'ex_a2_a3', mapId: 'map_adrian_halcyon', sourceLocationId: 'loc_a2_corridor', destinationLocationId: 'loc_a3_briefing', direction: 'south', reverseDirection: 'north', canonScope: 'interactive_continuity' },
  { id: 'ex_a3_a2', mapId: 'map_adrian_halcyon', sourceLocationId: 'loc_a3_briefing', destinationLocationId: 'loc_a2_corridor', direction: 'north', reverseDirection: 'south', canonScope: 'interactive_continuity' },
  { id: 'ex_a3_a4', mapId: 'map_adrian_halcyon', sourceLocationId: 'loc_a3_briefing', destinationLocationId: 'loc_a4_records', direction: 'east', reverseDirection: 'west', locked: true, requirements: [{ type: 'flag_present', target: 'adrian_requested_info' }], canonScope: 'interactive_continuity' },
  { id: 'ex_a4_a3', mapId: 'map_adrian_halcyon', sourceLocationId: 'loc_a4_records', destinationLocationId: 'loc_a3_briefing', direction: 'west', reverseDirection: 'east', canonScope: 'interactive_continuity' },
  { id: 'ex_a2_a5', mapId: 'map_adrian_halcyon', sourceLocationId: 'loc_a2_corridor', destinationLocationId: 'loc_a5_transit', direction: 'north', reverseDirection: 'south', canonScope: 'interactive_continuity' },
  { id: 'ex_a5_a2', mapId: 'map_adrian_halcyon', sourceLocationId: 'loc_a5_transit', destinationLocationId: 'loc_a2_corridor', direction: 'south', reverseDirection: 'north', canonScope: 'interactive_continuity' },

  // Priya Exits
  { id: 'ex_p1_p2', mapId: 'map_priya_clinic', sourceLocationId: 'loc_p1_intake', destinationLocationId: 'loc_p2_admin', direction: 'west', reverseDirection: 'east', canonScope: 'interactive_continuity' },
  { id: 'ex_p2_p1', mapId: 'map_priya_clinic', sourceLocationId: 'loc_p2_admin', destinationLocationId: 'loc_p1_intake', direction: 'east', reverseDirection: 'west', canonScope: 'interactive_continuity' },
  { id: 'ex_p1_p3', mapId: 'map_priya_clinic', sourceLocationId: 'loc_p1_intake', destinationLocationId: 'loc_p3_treatment', direction: 'south', reverseDirection: 'north', canonScope: 'interactive_continuity' },
  { id: 'ex_p3_p1', mapId: 'map_priya_clinic', sourceLocationId: 'loc_p3_treatment', destinationLocationId: 'loc_p1_intake', direction: 'north', reverseDirection: 'south', canonScope: 'interactive_continuity' },
  { id: 'ex_p3_p4', mapId: 'map_priya_clinic', sourceLocationId: 'loc_p3_treatment', destinationLocationId: 'loc_p4_water', direction: 'east', reverseDirection: 'west', canonScope: 'interactive_continuity' },
  { id: 'ex_p4_p3', mapId: 'map_priya_clinic', sourceLocationId: 'loc_p4_water', destinationLocationId: 'loc_p3_treatment', direction: 'west', reverseDirection: 'east', canonScope: 'interactive_continuity' },
  { id: 'ex_p2_p5', mapId: 'map_priya_clinic', sourceLocationId: 'loc_p2_admin', destinationLocationId: 'loc_p5_supply', direction: 'south', reverseDirection: 'north', locked: true, requirements: [{ type: 'item_present', target: 'cabinet_key' }], canonScope: 'interactive_continuity' },
  { id: 'ex_p5_p2', mapId: 'map_priya_clinic', sourceLocationId: 'loc_p5_supply', destinationLocationId: 'loc_p2_admin', direction: 'north', reverseDirection: 'south', canonScope: 'interactive_continuity' },
];

export const storyInteractablesSeed: StoryInteractable[] = [
  // Mara Objects
  {
    id: 'obj_mara_relay',
    locationId: 'loc_m4_relay',
    title: 'Damaged Analogue Relay',
    aliases: ['relay', 'damaged relay', 'analogue relay', 'unit'],
    description: 'A corroded but functional piece of old-world routing hardware.',
    availableVerbs: ['examine', 'repair', 'splice', 'use'],
    interactions: [
      {
        verb: 'examine',
        directObjectId: 'obj_mara_relay',
        successText: 'The casing is shattered, but the core fibre optic connections remain intact.',
      },
      {
        verb: 'repair',
        directObjectId: 'obj_mara_relay',
        successText: 'You bypass the broken casing and hardwire the bypass loop.',
        effects: [{ type: 'set_flag', target: 'mara_unlocked_archive' }, { type: 'add_journal', target: '', text: 'Repaired the analogue relay.' }],
        onceOnly: true
      }
    ],
    canonScope: 'interactive_continuity'
  },
  {
    id: 'obj_mara_hatch',
    locationId: 'loc_m2_junction',
    title: 'Service Hatch',
    aliases: ['hatch', 'service hatch', 'grate'],
    description: 'A heavy metal floor hatch obscured by cables.',
    hidden: true,
    availableVerbs: ['examine', 'open', 'search'],
    interactions: [
      {
        verb: 'search',
        directObjectId: 'obj_mara_hatch',
        successText: 'You clear away the cables, revealing the rusted hatch.',
        effects: [{ type: 'set_flag', target: 'mara_found_hatch' }],
        onceOnly: true
      }
    ],
    canonScope: 'interactive_continuity'
  },

  // Adrian Objects
  {
    id: 'obj_adrian_terminal',
    locationId: 'loc_a4_records',
    title: 'Intelligence Review Terminal',
    aliases: ['terminal', 'records', 'computer'],
    description: 'A secure Halcyon workstation.',
    availableVerbs: ['examine', 'read', 'access', 'download'],
    interactions: [
      {
        verb: 'read',
        directObjectId: 'obj_adrian_terminal',
        successText: 'The casualty projections for Midstack are staggering. The structural models indicate deliberate neglect.',
        effects: [{ type: 'set_flag', target: 'adrian_read_records' }, { type: 'discover_lore', target: 'midstack' }],
        onceOnly: true
      }
    ],
    canonScope: 'interactive_continuity'
  },
  {
    id: 'obj_adrian_gear',
    locationId: 'loc_a1_prep',
    title: 'Tactical Gear',
    aliases: ['gear', 'equipment', 'armour', 'weapons'],
    description: 'Standard Halcyon issue.',
    availableVerbs: ['examine', 'take', 'equip'],
    interactions: [
      {
        verb: 'take',
        directObjectId: 'obj_adrian_gear',
        successText: 'You secure your weapon and rig.',
        effects: [{ type: 'add_item', target: 'halcyon_rig' }],
        onceOnly: true
      }
    ],
    canonScope: 'interactive_continuity'
  },

  // Priya Objects
  {
    id: 'obj_priya_key',
    locationId: 'loc_p2_admin',
    title: 'Cabinet Key',
    aliases: ['key', 'cabinet key'],
    description: 'A simple physical key, increasingly rare.',
    portable: true,
    inventoryItemId: 'cabinet_key',
    availableVerbs: ['examine', 'take'],
    interactions: [
      {
        verb: 'take',
        directObjectId: 'obj_priya_key',
        successText: 'You pocket the supply cabinet key.',
        effects: [{ type: 'add_item', target: 'cabinet_key' }],
        onceOnly: true
      }
    ],
    canonScope: 'interactive_continuity'
  },
  {
    id: 'obj_priya_cabinet',
    locationId: 'loc_p5_supply',
    title: 'Supply Cabinet',
    aliases: ['cabinet', 'supplies'],
    description: 'Contains emergency water filtration units.',
    availableVerbs: ['examine', 'open', 'search'],
    interactions: [
      {
        verb: 'search',
        directObjectId: 'obj_priya_cabinet',
        successText: 'You find a hidden stash of high-grade filters.',
        effects: [{ type: 'add_item', target: 'high_grade_filters' }],
        onceOnly: true
      }
    ],
    canonScope: 'interactive_continuity'
  }
];
