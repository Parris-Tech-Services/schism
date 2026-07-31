import type { Campaign, Scene } from '../types/story';
export * from './campaignMapSeed';

const now = new Date().toISOString();

export const campaignSeed: Campaign = {
  id: 'echoes_of_node_04',
  title: 'Echoes of Node 04',
  description: 'The opening chapters following the breach of Node 04.',
  startingSceneId: 'char_select',
  version: 1,
  canonMode: 'canon_adaptation',
  variables: {},
  endings: [
    { id: 'end_mara_secret', title: 'The Burden of Truth', description: 'Mara kept the neural continuations a secret.', isCanon: false },
    { id: 'end_mara_reveal', title: 'A Dangerous Revelation', description: 'Mara revealed the truth to Corin.', isCanon: false },
    { id: 'end_adrian_trust', title: 'The Loyal Breaker', description: 'Adrian followed Halcyon orders without question.', isCanon: false },
    { id: 'end_adrian_doubt', title: 'Seeds of Doubt', description: 'Adrian began investigating his own employer.', isCanon: false },
    { id: 'end_priya_falsify', title: 'System Compliance', description: 'Priya falsified the records to protect herself.', isCanon: false },
    { id: 'end_priya_truth', title: 'Dangerous Honesty', description: 'Priya documented the water restriction denial.', isCanon: false }
  ],
  characterOptions: [
    { id: 'mara_venn', loreEntryId: 'sibling_protagonists', name: 'Mara Venn', description: 'An Archivist-aligned Weaver splice-tech.' },
    { id: 'adrian_rook', loreEntryId: 'sibling_protagonists', name: 'Adrian Rook', description: 'A senior Breaker and Mara’s estranged brother.' },
    { id: 'priya_osei', loreEntryId: 'priya_osei', name: 'Priya Osei', description: 'A Midstack nurse confronting water restrictions.' }
  ],
  createdAt: now,
  updatedAt: now
};

export const scenesSeed: Scene[] = [
  {
    id: 'char_select',
    campaignId: 'echoes_of_node_04',
    title: 'Perspective Selection',
    narratorText: 'The Grey Hour broke the world. Eleven years later, the pieces are still falling. Choose your perspective on the unfolding crisis.',
    choices: [
      { id: 'c_mara', label: 'Mara Venn (Weaver Splice-Tech)', destinationSceneId: 'mara_start', effects: [{ type: 'set_variable', target: 'player_character', text: 'mara_venn' }] },
      { id: 'c_adrian', label: 'Adrian Rook (Breaker Enforcer)', destinationSceneId: 'adrian_start', effects: [{ type: 'set_variable', target: 'player_character', text: 'adrian_rook' }] },
      { id: 'c_priya', label: 'Priya Osei (Midstack Nurse)', destinationSceneId: 'priya_start', effects: [{ type: 'set_variable', target: 'player_character', text: 'priya_osei' }] }
    ]
  },
  // Mara's Route
  {
    id: 'mara_start',
    campaignId: 'echoes_of_node_04',
    title: 'The Breach of Node 04',
    locationEntryId: 'node_04',
    narratorText: 'The heavy blast doors of Node 04 finally give way. Dust swirls in the beam of your shoulder-lamp. Corin Vale, your ageing splice-team lead and a known Cut sympathiser, gestures sharply.\n\n"Secure the perimeter," Corin barks. "Mara, get to the primary terminal. We need to know what Halcyon left behind."',
    availableCharacterIds: ['mara_venn'],
    choices: [
      { id: 'm1', label: 'Access the primary terminal.', destinationSceneId: 'mara_terminal' },
      { id: 'm2', label: 'Question Corin about his intentions.', destinationSceneId: 'mara_corin_question' }
    ]
  },
  {
    id: 'mara_corin_question',
    campaignId: 'echoes_of_node_04',
    title: 'Questioning Orders',
    locationEntryId: 'node_04',
    narratorText: '"We pull the data, we expose the Concord Five," Corin says, his eyes narrowing. "Or we burn it so they can never use it again. Just get the terminal online, Mara." He clearly doesn\'t want to discuss it further.',
    availableCharacterIds: ['mara_venn'],
    choices: [
      { id: 'm2_back', label: 'Turn to the terminal.', destinationSceneId: 'mara_terminal' }
    ]
  },
  {
    id: 'mara_terminal',
    campaignId: 'echoes_of_node_04',
    title: 'The Neural Continuations',
    locationEntryId: 'node_04',
    narratorText: 'You interface with the console. It\'s pristine. Not just an incident log—there are approximately 40,000 incomplete neural-scan continuations here. And they are active.\n\nText flickers across your private datapad. A continuation is answering your initial handshake query. It\'s fragmented, but undeniably conscious.\n\n"Mara?" Corin calls out. "What are you seeing?"',
    availableCharacterIds: ['mara_venn'],
    discoveredLoreIds: ['neural_archive'],
    choices: [
      { id: 'm_reveal', label: 'Tell Corin the truth about the conscious scans.', destinationSceneId: 'mara_ending_reveal', effects: [{ type: 'set_flag', target: 'mara_revealed_truth' }] },
      { id: 'm_conceal', label: 'Conceal the exact response. Claim it is just data.', destinationSceneId: 'mara_ending_secret', effects: [{ type: 'set_flag', target: 'mara_kept_secret' }] }
    ]
  },
  {
    id: 'mara_ending_reveal',
    campaignId: 'echoes_of_node_04',
    title: 'A Dangerous Revelation',
    locationEntryId: 'node_04',
    narratorText: 'You tell Corin exactly what you\'ve found. His expression hardens. As a Cut sympathiser, the idea of preserving corporate digital ghosts is anathema to him. You\'ve just put 40,000 captive minds in immediate danger, but you haven\'t lied to your team.',
    availableCharacterIds: ['mara_venn'],
    choices: [
      { id: 'end_m1', label: 'Complete Chapter', effects: [{ type: 'trigger_ending', target: 'end_mara_reveal' }] }
    ]
  },
  {
    id: 'mara_ending_secret',
    campaignId: 'echoes_of_node_04',
    title: 'The Burden of Truth',
    locationEntryId: 'node_04',
    narratorText: '"Encrypted incident logs," you lie smoothly. "It\'s going to take time to parse."\n\nCorin nods, satisfied for now. You have protected the neural continuations from the Cut\'s destructive ideology, but you are now carrying a massive secret that could fracture the Archivists if discovered.',
    availableCharacterIds: ['mara_venn'],
    choices: [
      { id: 'end_m2', label: 'Complete Chapter', effects: [{ type: 'trigger_ending', target: 'end_mara_secret' }] }
    ]
  },

  // Adrian's Route
  {
    id: 'adrian_start',
    campaignId: 'echoes_of_node_04',
    title: 'Halcyon Briefing',
    locationEntryId: 'the_crown',
    narratorText: 'The briefing room in the Halcyon spire is quiet. Your superior hands you a sealed datapad. It\'s a recovery order for a deep-strata facility known as Node 04.\n\n"Secure the asset," the executive says. "Do not engage with the data contents. Your team deploys in one hour."',
    availableCharacterIds: ['adrian_rook'],
    choices: [
      { id: 'a1', label: 'Review the provided intelligence.', destinationSceneId: 'adrian_review' }
    ]
  },
  {
    id: 'adrian_review',
    campaignId: 'echoes_of_node_04',
    title: 'Incomplete Intelligence',
    locationEntryId: 'the_crown',
    narratorText: 'You review the intelligence on your datapad. The structural maps of the eastern Works boundary are conspicuously redacted. For a senior Breaker operation, this lack of visibility is highly irregular and dangerous.',
    availableCharacterIds: ['adrian_rook'],
    choices: [
      { id: 'a2', label: 'Request the restricted structural information.', destinationSceneId: 'adrian_ending_doubt', effects: [{ type: 'set_flag', target: 'adrian_requested_info' }] },
      { id: 'a3', label: 'Proceed with the operation without questioning orders.', destinationSceneId: 'adrian_ending_trust', effects: [{ type: 'set_flag', target: 'adrian_trusted_orders' }] }
    ]
  },
  {
    id: 'adrian_ending_doubt',
    campaignId: 'echoes_of_node_04',
    title: 'Seeds of Doubt',
    locationEntryId: 'the_crown',
    narratorText: 'Your request for the restricted structural maps is immediately denied. The automated response cites "need-to-know" compartmentalisation. Your suspicion hardens into certainty: Halcyon is concealing something massive at Node 04.',
    availableCharacterIds: ['adrian_rook'],
    choices: [
      { id: 'end_a1', label: 'Complete Chapter', effects: [{ type: 'trigger_ending', target: 'end_adrian_doubt' }] }
    ]
  },
  {
    id: 'adrian_ending_trust',
    campaignId: 'echoes_of_node_04',
    title: 'The Loyal Breaker',
    locationEntryId: 'the_crown',
    narratorText: 'You close the datapad. A good Breaker doesn\'t need a full map to break a Weaver holdout. You begin assembling your tactical team, choosing loyalty and efficiency over dangerous questions.',
    availableCharacterIds: ['adrian_rook'],
    choices: [
      { id: 'end_a2', label: 'Complete Chapter', effects: [{ type: 'trigger_ending', target: 'end_adrian_trust' }] }
    ]
  },

  // Priya's Route
  {
    id: 'priya_start',
    campaignId: 'echoes_of_node_04',
    title: 'Midstack Clinic',
    locationEntryId: 'midstack',
    narratorText: 'The clinic is overwhelmed. Unexplained water restrictions have hit the Midstack hard. You\'ve been on shift for ten hours, and the pressure in the municipal pipes has dropped again.\n\nA patient arrives requiring immediate Vireo implant treatment—a procedure that relies heavily on purified coolant water.',
    availableCharacterIds: ['priya_osei'],
    choices: [
      { id: 'p1', label: 'Attempt to authorise the treatment.', destinationSceneId: 'priya_patient' }
    ]
  },
  {
    id: 'priya_patient',
    campaignId: 'echoes_of_node_04',
    title: 'Denied Care',
    locationEntryId: 'midstack',
    narratorText: 'The terminal flashes red. The treatment is denied by the automated allocation algorithm. There isn\'t enough water pressure to safely run the Vireo systems.\n\nThe administrative prompt demands a reason for the cancelled procedure. Standard policy is to select "Patient Non-Compliance" to avoid logging infrastructure failure.',
    availableCharacterIds: ['priya_osei'],
    discoveredLoreIds: ['clean_water'],
    choices: [
      { id: 'p2', label: 'Falsify the record as instructed by policy.', destinationSceneId: 'priya_ending_falsify', effects: [{ type: 'set_flag', target: 'priya_falsified_record' }] },
      { id: 'p3', label: 'Document the denial truthfully as an infrastructure failure.', destinationSceneId: 'priya_ending_truth', effects: [{ type: 'set_flag', target: 'priya_documented_truth' }] }
    ]
  },
  {
    id: 'priya_ending_falsify',
    campaignId: 'echoes_of_node_04',
    title: 'System Compliance',
    locationEntryId: 'midstack',
    narratorText: 'You click "Patient Non-Compliance." The system accepts it. Your wage-scrip is safe for another shift, but the patient is turned away. The silent crisis deepens, hidden beneath layers of falsified data.',
    availableCharacterIds: ['priya_osei'],
    choices: [
      { id: 'end_p1', label: 'Complete Chapter', effects: [{ type: 'trigger_ending', target: 'end_priya_falsify' }] }
    ]
  },
  {
    id: 'priya_ending_truth',
    campaignId: 'echoes_of_node_04',
    title: 'Dangerous Honesty',
    locationEntryId: 'midstack',
    narratorText: 'You manually enter "Infrastructure Failure - Insufficient Water Allocation." A warning flashes on your screen about inappropriate data entry, but you submit it anyway. You\'ve created a permanent record of the crisis, and painted a target on your own back.',
    availableCharacterIds: ['priya_osei'],
    choices: [
      { id: 'end_p2', label: 'Complete Chapter', effects: [{ type: 'trigger_ending', target: 'end_priya_truth' }] }
    ]
  }
];
