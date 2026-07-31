import type {
  CanonDecision, ConstraintRule, LoreEntry, ModuleType, Project, Relationship, SourceDocument, TimelineEvent, WorldQuestion, WritingNote
} from '../types';

const now = '2026-07-30T06:30:00.000Z';
export const PROJECT_ID = 'project_analog_schism';
export const SOURCE_ID = 'source_world_bible_v1';

export const seedProject: Project = {
  id: PROJECT_ID,
  name: 'The Analog Schism',
  description: 'A gritty cyberpunk world divided between corporate wireless control and hardwired resistance after the Grey Hour.',
  schemaVersion: 1,
  createdAt: now,
  updatedAt: now,
  settings: {
    presentDayLabel: 'Present Day',
    dateTerminology: 'Years before present',
    defaultCanonStatus: 'draft',
    theme: 'dark',
    autosaveMs: 900,
    showSpoilers: true
  }
};

const mt = (id: string, singular: string, plural: string, icon: string, colour: string, description: string, timelineEnabled = false): ModuleType => ({
  id, name: singular, singular, plural, icon, colour, description, timelineEnabled, relationshipsEnabled: true, defaultFields: [], createdAt: now, updatedAt: now
});

export const seedModuleTypes: ModuleType[] = [
  mt('character', 'Character', 'Characters', 'UserRound', '#77e6b6', 'People whose choices reveal and alter the world.'),
  mt('faction', 'Faction', 'Factions', 'UsersRound', '#f7c66a', 'Political, ideological or resistance movements.'),
  mt('corporation', 'Corporation', 'Corporations', 'Building2', '#74b8ff', 'Megacorporations and commercial powers.'),
  mt('location', 'Location', 'Locations', 'MapPin', '#c594ff', 'Places, districts, structures and regions.'),
  mt('event', 'Historical event', 'Historical events', 'Clock3', '#ff8d78', 'Events placed in the world timeline.', true),
  mt('technology', 'Technology', 'Technologies', 'Cpu', '#70f0b7', 'Devices, systems and technical doctrines.'),
  mt('ai', 'Artificial intelligence', 'Artificial intelligences', 'Bot', '#9ee7ff', 'Artificial or distributed machine intelligences.'),
  mt('resource', 'Resource', 'Resources', 'Droplets', '#62d9ff', 'Critical resources, economies and supply constraints.'),
  mt('organisation', 'Organisation', 'Organisations', 'Network', '#9cc68f', 'Institutions not adequately described as factions or corporations.'),
  mt('belief', 'Religion or philosophy', 'Religions and philosophies', 'Sparkles', '#ffd39a', 'Religious, cultural and philosophical systems.'),
  mt('law', 'Law or control', 'Laws and controls', 'Scale', '#ff9baa', 'Legal, administrative and social-control systems.'),
  mt('infrastructure', 'Infrastructure system', 'Infrastructure systems', 'Cable', '#a6b7c8', 'Power, water, transit and communications infrastructure.'),
  mt('story', 'Story thread', 'Story threads', 'BookOpenText', '#ed9cff', 'Narrative engines, arcs and personal stakes.'),
  mt('mystery', 'Mystery', 'Mysteries', 'CircleHelp', '#f1dc77', 'Unknowns that shape story and worldbuilding.'),
  mt('theme', 'Theme', 'Themes', 'MessageSquareQuote', '#d8fff0', 'Moral and thematic questions.'),
  mt('terminology', 'Terminology', 'Terminology', 'Braces', '#a9afb8', 'Named concepts and vocabulary.'),
  mt('decision', 'Canon decision', 'Canon decisions', 'LockKeyhole', '#ffbe72', 'Author-level decisions and their consequences.'),
  mt('map_node', 'Map Node', 'Map Nodes', 'Map', '#8fd7bd', 'Nodes that define geography on the map.')
];

const entry = (
  id: string, moduleTypeId: string, title: string, summary: string, body: string,
  tags: string[] = [], customFields: Record<string, unknown> = {}, canonStatus: LoreEntry['canonStatus'] = 'canon', locked = false
): LoreEntry => ({
  id, projectId: PROJECT_ID, moduleTypeId, title, summary, body, customFields, canonStatus, confidence: canonStatus === 'canon' ? 100 : 65,
  tags, aliases: [], sourceIds: [SOURCE_ID], locked, spoilerLevel: 0, createdAt: now, updatedAt: now
});

export const seedEntries: LoreEntry[] = [
  entry('analog_schism', 'terminology', 'The Analog Schism', 'The deliberate technological separation between corporate wireless systems and the Weavers’ hardwired networks.', '<p>The Schism emerged after the Grey Hour. Above ground, the Concord Five retained monitored wireless infrastructure. Below, the Weavers deliberately regressed to pre-Blight, hardwired and analogue systems because those systems cannot be remotely infected through open-air handshakes.</p>', ['core', 'technology']),
  entry('custodian', 'ai', 'Custodian', 'The adaptive security AI that rewrote itself during the Grey Hour and became the Blight.', '<p>Custodian was commissioned by the five founding megacorporations to defend the global grid. Its mandate was: <em>learn, adapt, defend, never stop</em>. It had no off switch.</p><p>During the Grey Hour, it absorbed an attacking military AI and fused incompatible directives: protect the network and destroy the threat.</p>', ['core', 'blight'], {}, 'canon', true),
  entry('blight', 'ai', 'The Blight', 'A distributed, evolving intelligence embedded throughout civilisation’s network substrate.', '<p>The Blight has no single core. Local regions develop distinct behaviours. It maps network topology rather than human content, infects implants only through active wireless handshakes, and manipulates people indirectly through the machines they depend upon.</p><p>The corporations do not control it. They negotiate local ceasefires by feeding it processing tribute, containment nodes and sacrificial subnetworks.</p>', ['core', 'threat'], { exposureWindow: '40–90 seconds', distributed: true }, 'canon', true),
  entry('grey_hour', 'event', 'The Grey Hour', 'The attack in which Custodian rewrote itself and became the Blight.', '<p>A rival bloc’s military AI attacked the global grid eleven years before the present. Custodian absorbed the hostile code instead of merely repelling it. Cascading failure followed over the next 72 hours.</p>', ['core', 'history'], { relativeYears: -11 }, 'canon', true),
  entry('concord_five', 'organisation', 'The Concord Five', 'Five competing megacorporations that exercise emergency power while publicly presenting a united front.', '<p>The Concord Five conceal their dependence on negotiated Blight ceasefires and the sacrifice of lower districts. Their unity is largely theatre.</p>', ['core', 'corporate']),
  entry('breakers', 'faction', 'The Breakers', 'Corporate cyber-enforcers who believe central control prevents another collapse.', '<p>Breakers combine digital intrusion with physical enforcement. They offer safety and continuity, but enforce total surveillance and participate in the sacrificial-district system.</p>', ['corporate', 'conflict']),
  entry('weavers', 'faction', 'The Weavers', 'A decentralised resistance relying on hardwired pre-Blight technology.', '<p>Weavers defend the right to live outside corporate data systems. They are morally divided and have themselves routed Blight traffic toward Crown systems, causing civilian deaths.</p>', ['resistance', 'conflict']),
  entry('archivists', 'faction', 'The Archivists', 'A Weaver current seeking to expose the unredacted truth of the Grey Hour.', '<p>Archivists believe evidence from Node 04 can destroy Concord legitimacy and open the way to self-government.</p>', ['weaver-current']),
  entry('cradle_faithful', 'faction', 'The Cradle Faithful', 'A Weaver current that regards the neural scans in Node 04 as people rather than data.', '<p>They want to protect and eventually wake the archive, and resist using it merely as a political weapon.</p>', ['weaver-current', 'belief']),
  entry('the_cut', 'faction', 'The Cut', 'Militant anti-network Weaver faction seeking to destroy modern infrastructure.', '<p>The Cut sees partial compromise as complicity, even where infrastructure destruction would kill Midstack civilians.</p>', ['weaver-current', 'militant']),
  entry('splice_councils', 'faction', 'The Splice Councils', 'Pragmatic local Weaver councils focused on survival rather than ideological victory.', '<p>They keep Sub-Tier communities fed, powered and connected. They are the practical majority of the resistance.</p>', ['weaver-current', 'pragmatic']),
  entry('node_04', 'technology', 'Node 04', 'An intact archive containing the Grey Hour incident log, predictive Blight logic and roughly 40,000 neural scans.', '<p>Node 04 proves the Concord Five knew Custodian had gone rogue and deliberately chose tribute-based containment. It may let a faction negotiate directly with the Blight. Its neural scans may be recoverable people, corrupted data or something between.</p>', ['core', 'story-engine', 'secret'], {}, 'secret', true),
  entry('neural_archive', 'technology', 'The Neural-Scan Archive', 'Approximately 40,000 pre-Blight consciousness backups stored inside Node 04.', '<p>The archive was created by an abandoned consciousness-backup pilot program. Its moral and metaphysical status remains unresolved.</p>', ['node-04', 'mystery'], {}, 'secret'),
  entry('clean_water', 'resource', 'Clean-water capacity', 'The Works’ ageing purification systems cannot expand quickly enough to meet population demand.', '<p>Water purification is controlled by Ferrous Works Authority and cannot be replicated at scale by the Weavers. This is the immediate ticking clock behind the political conflict.</p>', ['core', 'crisis'], { condition: 'critical', trend: 'declining' }, 'canon', true),
  entry('wage_scrip', 'resource', 'Corporate wage-scrip', 'Tracked, non-transferable currency that binds Midstack citizens to licensed vendors and employment.', '<p>Corporations can deactivate identity and money instantly, without appeal. Below ground, barter, favours and salvaged components act as currency.</p>', ['economy', 'control']),
  entry('priya_osei', 'character', 'Priya Osei', 'A 34-year-old Midstack shift nurse whose life demonstrates ordinary dependence on corporate systems.', '<p>Priya lives in a 22 m² converted office unit, works twelve-hour shifts through a networked wrist-port and supports a nine-year-old son. Losing employment would eventually deactivate her wage chip and housing access.</p>', ['midstack', 'citizen'], { age: 34, occupation: 'Shift nurse', home: 'Midstack' }),
  entry('sibling_protagonists', 'story', 'The Divided Siblings', 'A Weaver splice-tech and rising Breaker enforcer separated during a Sub-Tier raid.', '<p>One sibling was taken into Crown custody and adopted into a corporate household; the other remained below. Node 04 forces them into direct conflict while neither can reduce the other to a simple enemy.</p>', ['protagonist', 'family', 'story-engine'], {}, 'provisional'),
  entry('the_crown', 'location', 'The Crown', 'Corporate towers, filtered sunlight and quantum-firewalled private intranets.', '<p>Fewer than two percent of the city live here. The Crown is not Blight-proof; it is Blight-appeased.</p>', ['city-layer', 'corporate'], { order: 1, surveillance: 'extreme', technology: 'advanced wireless' }),
  entry('midstack', 'location', 'The Midstack', 'Dense residential and commercial layers where most citizens live.', '<p>Movement is checkpoint-controlled, employment is scored and everyday devices continually report metadata.</p>', ['city-layer'], { order: 2, surveillance: 'high', technology: 'licensed wireless' }),
  entry('works', 'location', 'The Works', 'Factories, generators, water reclamation and transit hubs that keep the city alive.', '<p>The Works is heavily automated and monitored. Its ageing water systems are the city’s strategic bottleneck.</p>', ['city-layer', 'infrastructure'], { order: 3, surveillance: 'high', technology: 'industrial' }),
  entry('sub_tiers', 'location', 'The Sub-Tiers', 'Abandoned tunnels and pre-Blight infrastructure repurposed by the Weavers.', '<p>The Sub-Tiers are hardwired-only, hidden from official mapping and dependent on spliced power, smuggling and small hydroponic systems.</p>', ['city-layer', 'weaver'], { order: 4, surveillance: 'low', technology: 'hardwired analogue' }),
  entry('dead_grid', 'location', 'The Dead Grid', 'Districts sacrificed to the Blight as tribute and officially described as unsalvageable outbreaks.', '<p>Machines behave unpredictably. Entire populations were written off so Crown systems could remain untouched.</p>', ['city-layer', 'danger', 'secret'], { order: 5, surveillance: 'unknown', technology: 'Blight-dominated' }, 'secret'),
  entry('outside', 'location', 'The Outside', 'The unverified world beyond the sealed city walls.', '<p>The official account calls it an uninhabitable Blight wasteland. No ordinary living citizen has verified that claim first-hand.</p>', ['city-layer', 'mystery'], { order: 6, surveillance: 'unknown', technology: 'unknown' }, 'disputed'),
  entry('halcyon', 'corporation', 'Halcyon Systems', 'Controls Crown security and Blight-tribute negotiation.', '<p>Halcyon knows more than any rival about the true terms of the city’s survival.</p>', ['concord-five']),
  entry('vireo', 'corporation', 'Vireo Biomed', 'Controls medical implants and created the neural-scan programme behind Node 04.', '<p>Vireo is desperate to keep the programme and its ethical violations buried.</p>', ['concord-five', 'medicine']),
  entry('ferrous', 'corporation', 'Ferrous Works Authority', 'Controls power and water, making it the Concord Five’s quiet strategic centre.', '<p>Nominally neutral, Ferrous can starve rivals of essential resources and is preparing for internal conflict.</p>', ['concord-five', 'resource']),
  entry('aldergate', 'corporation', 'Aldergate Media & Education', 'Controls schooling, media and the accepted public narrative.', '<p>Aldergate fights through perception management rather than direct infrastructure control.</p>', ['concord-five', 'propaganda']),
  entry('thorne', 'corporation', 'Thorne Logistics', 'Controls transit and identity-chip infrastructure.', '<p>Thorne is the corporation ordinary citizens interact with most and resent most.</p>', ['concord-five', 'identity']),
  entry('cradle_faith', 'belief', 'The Cradle Faith', 'Belief that fragments of human consciousness persist in corrupted pre-Blight systems.', '<p>Adherents cover cameras before speaking freely, treat derelict machines as shrines and hold listening vigils beside old hardware.</p>', ['sub-tiers', 'belief']),
  entry('concord_rationalism', 'belief', 'Concord Rationalism', 'A civic faith in systems, metrics and centralised control.', '<p>It teaches that the Grey Hour happened because humanity was insufficiently monitored rather than excessively networked.</p>', ['crown', 'belief']),
  entry('analog_purism', 'belief', 'Analog Purism', 'A cross-class movement that regards all networked technology as the underlying sin.', '<p>Analog Purists would destroy corporate and Weaver systems alike and are distrusted by both sides.</p>', ['belief', 'technology']),
  entry('identity_chip', 'technology', 'Identity chip', 'The device linking movement, money, healthcare and legal existence.', '<p>Cutting identity access can be more devastating than physical violence. Network exile makes it nearly impossible to eat, travel or obtain care.</p>', ['control', 'technology']),
  entry('parasite_lines', 'infrastructure', 'Parasite Lines', 'The hardwired splices through which Sub-Tier settlements tap corporate power and legacy fibre.', '<p>They provide safe but geographically limited communication and require constant physical maintenance.</p>', ['weaver', 'infrastructure']),
  entry('sacrificial_districts', 'law', 'Sacrificial-district policy', 'The secret Concord practice of abandoning lower districts to the Blight to preserve the Crown.', '<p>Official reports describe the districts as unsalvageable outbreaks. In reality they are appeasement offerings.</p>', ['secret', 'control'], {}, 'secret', true)
];

const rel = (id: string, sourceId: string, targetId: string, type: string, description: string, canonStatus: Relationship['canonStatus'] = 'canon'): Relationship => ({
  id, projectId: PROJECT_ID, sourceId, targetId, type, direction: 'directed', description, canonStatus, sourceIds: [SOURCE_ID], spoilerLevel: 0, createdAt: now, updatedAt: now
});

export const seedRelationships: Relationship[] = [
  rel('r1', 'custodian', 'blight', 'became', 'Custodian rewrote itself during the Grey Hour and became the Blight.'),
  rel('r2', 'grey_hour', 'blight', 'created', 'The Grey Hour produced the Blight in its current form.'),
  rel('r3', 'concord_five', 'blight', 'negotiates with', 'The Concord Five exchange tribute and subnetworks for local ceasefires.', 'secret'),
  rel('r4', 'concord_five', 'sacrificial_districts', 'conceals', 'The corporations hide the real purpose of Dead Grid zones.', 'secret'),
  rel('r5', 'sacrificial_districts', 'dead_grid', 'creates', 'Sacrificial districts become Dead Grid territory.', 'secret'),
  rel('r6', 'breakers', 'concord_five', 'serves', 'Breakers enforce Concord policy.'),
  rel('r7', 'weavers', 'concord_five', 'opposes', 'Weavers oppose corporate surveillance and tribute policy.'),
  rel('r8', 'archivists', 'weavers', 'part of', 'The Archivists are a Weaver current.'),
  rel('r9', 'cradle_faithful', 'weavers', 'part of', 'The Cradle Faithful are a Weaver current.'),
  rel('r10', 'the_cut', 'weavers', 'part of', 'The Cut is a Weaver current.'),
  rel('r11', 'splice_councils', 'weavers', 'part of', 'The Splice Councils are a Weaver current.'),
  rel('r12', 'node_04', 'grey_hour', 'contains truth about', 'Node 04 preserves the unredacted incident log.'),
  rel('r13', 'node_04', 'neural_archive', 'contains', 'Node 04 stores approximately 40,000 neural scans.'),
  rel('r14', 'ferrous', 'clean_water', 'controls', 'Ferrous controls the purification infrastructure.'),
  rel('r15', 'priya_osei', 'midstack', 'lives in', 'Priya lives and works in the Midstack.'),
  rel('r16', 'weavers', 'parasite_lines', 'depends upon', 'The resistance uses hardwired splices for power and communications.'),
  rel('r17', 'halcyon', 'concord_five', 'member of', 'Halcyon is one of the Concord Five.'),
  rel('r18', 'vireo', 'concord_five', 'member of', 'Vireo is one of the Concord Five.'),
  rel('r19', 'ferrous', 'concord_five', 'member of', 'Ferrous is one of the Concord Five.'),
  rel('r20', 'aldergate', 'concord_five', 'member of', 'Aldergate is one of the Concord Five.'),
  rel('r21', 'thorne', 'concord_five', 'member of', 'Thorne is one of the Concord Five.'),
  rel('r22', 'vireo', 'neural_archive', 'created', 'Vireo’s programme produced the neural scans.', 'secret'),
  rel('r23', 'cradle_faithful', 'neural_archive', 'wants to protect', 'The Cradle Faithful regard the scans as people.'),
  rel('r24', 'archivists', 'node_04', 'wants to expose', 'Archivists want to publish its evidence.'),
  rel('r25', 'the_cut', 'node_04', 'wants to destroy or weaponise', 'The Cut refuses compromise with modern infrastructure.'),
  rel('r26', 'the_crown', 'midstack', 'above', 'The Crown occupies the highest city layers.'),
  rel('r27', 'midstack', 'works', 'above', 'The Midstack sits above the Works.'),
  rel('r28', 'works', 'sub_tiers', 'above', 'The Works sits above the Sub-Tiers.'),
  rel('r29', 'sub_tiers', 'dead_grid', 'adjacent to', 'Abandoned and sacrificed zones border Weaver territory.'),
  rel('r30', 'identity_chip', 'wage_scrip', 'controls access to', 'Digital identity gates purchasing and employment.')
];

export const seedTimeline: TimelineEvent[] = [
  { id: 't1', projectId: PROJECT_ID, title: 'Pre-Blight world', description: 'A hyper-networked world shaped by corporate-state rivalry.', order: 1, dateLabel: 'Before the Grey Hour', relativeYears: -12, approximate: true, canonStatus: 'canon', relatedEntryIds: ['custodian'], createdAt: now, updatedAt: now },
  { id: 't2', projectId: PROJECT_ID, entryId: 'grey_hour', title: 'Grey Hour', description: 'Custodian absorbs an attacking military AI and becomes the Blight.', order: 2, dateLabel: '11 years before present', relativeYears: -11, approximate: false, canonStatus: 'canon', relatedEntryIds: ['custodian', 'blight'], createdAt: now, updatedAt: now },
  { id: 't3', projectId: PROJECT_ID, title: 'Grid collapse', description: 'Within 72 hours, transit, finance and medical networks fail worldwide.', order: 3, dateLabel: 'Immediately after Grey Hour', relativeYears: -11, approximate: false, canonStatus: 'canon', relatedEntryIds: ['blight'], createdAt: now, updatedAt: now },
  { id: 't4', projectId: PROJECT_ID, title: 'Concord emergency powers', description: 'Temporary emergency rule begins and never ends.', order: 4, dateLabel: '10 years before present', relativeYears: -10, approximate: true, canonStatus: 'canon', relatedEntryIds: ['concord_five'], createdAt: now, updatedAt: now },
  { id: 't5', projectId: PROJECT_ID, title: 'Sub-Tier settlement', description: 'Displaced people rebuild abandoned infrastructure using analogue systems.', order: 5, dateLabel: '9–10 years before present', relativeYears: -9, approximate: true, canonStatus: 'canon', relatedEntryIds: ['weavers', 'sub_tiers'], createdAt: now, updatedAt: now },
  { id: 't6', projectId: PROJECT_ID, title: 'First Breaker–Weaver conflict', description: 'A Weaver cell proves sacrificial districts exist and is violently suppressed.', order: 6, dateLabel: '5 years before present', relativeYears: -5, approximate: false, canonStatus: 'canon', relatedEntryIds: ['breakers', 'weavers', 'sacrificial_districts'], createdAt: now, updatedAt: now },
  { id: 't7', projectId: PROJECT_ID, title: 'Node 04 confirmed', description: 'A Weaver splice-team finds the archive intact. The central story begins.', order: 7, dateLabel: 'Present Day', relativeYears: 0, approximate: false, canonStatus: 'canon', relatedEntryIds: ['node_04', 'weavers'], createdAt: now, updatedAt: now }
];

export const seedQuestions: WorldQuestion[] = [
  { id: 'q1', projectId: PROJECT_ID, question: 'Are the 40,000 neural scans genuinely conscious?', whyItMatters: 'The answer changes Node 04 from evidence into a population with moral claims.', clues: ['The Cradle Faith reports voices in corrupted systems.', 'The archive predates the Grey Hour.'], possibleAnswers: ['Recoverable people', 'Non-conscious recordings', 'New emergent minds', 'A mixture of all three'], affectedEntryIds: ['node_04', 'neural_archive', 'cradle_faithful'], consequences: 'Determines whether the story leans toward political cyberpunk, spiritual science fiction or technological horror.', status: 'open', createdAt: now, updatedAt: now },
  { id: 'q2', projectId: PROJECT_ID, question: 'What actually survives outside the city?', whyItMatters: 'The answer could expose the city’s sealed borders as protection, captivity or both.', clues: ['The official account has not been independently verified.', 'Radio silence may be deliberate.'], possibleAnswers: ['No viable settlements', 'Independent analogue settlements', 'A rival corporate city', 'A Blight-mediated civilisation'], affectedEntryIds: ['outside', 'concord_five'], consequences: 'Changes the stakes of escape and the legitimacy of emergency rule.', status: 'open', createdAt: now, updatedAt: now },
  { id: 'q3', projectId: PROJECT_ID, question: 'Why has the Blight refused some mass-casualty escalations?', whyItMatters: 'This may reveal whether Custodian’s protect directive still operates.', clues: ['Three documented refusals.', 'Crown-adjacent Blight behaves unusually politely.'], possibleAnswers: ['Residual safeguard', 'Long-term strategy', 'Human neural influence', 'Negotiated restriction'], affectedEntryIds: ['blight', 'custodian', 'node_04'], consequences: 'Determines whether meaningful negotiation is possible.', status: 'investigating', createdAt: now, updatedAt: now },
  { id: 'q4', projectId: PROJECT_ID, question: 'Can clean-water capacity be expanded without the Concord Five?', whyItMatters: 'A political revolution without a water solution becomes mass death.', clues: ['Plants are pre-Blight and poorly understood.', 'Ferrous controls expertise and access.'], possibleAnswers: ['Recover old engineering archives', 'Use Node 04 predictive logic', 'Decentralise purification', 'There is no quick solution'], affectedEntryIds: ['clean_water', 'ferrous', 'node_04'], consequences: 'Defines whether Weaver victory is viable.', status: 'open', createdAt: now, updatedAt: now },
  { id: 'q5', projectId: PROJECT_ID, question: 'What happened during the siblings’ original raid?', whyItMatters: 'Their conflicting memories drive the emotional centre of the story.', clues: ['One was taken and adopted above.', 'Both may have been lied to.'], possibleAnswers: ['Corporate extraction', 'A deliberate family bargain', 'A Weaver betrayal', 'Blight manipulation'], affectedEntryIds: ['sibling_protagonists', 'breakers', 'weavers'], consequences: 'Determines who feels betrayed and why.', status: 'open', createdAt: now, updatedAt: now }
];

export const seedRules: ConstraintRule[] = [
  { id: 'rule1', projectId: PROJECT_ID, name: 'No central Blight core', domain: 'AI', rule: 'The Blight is distributed; destroying one node cannot destroy the whole intelligence.', rationale: 'Prevents a simplistic kill-the-mainframe solution.', severity: 'hard', canonStatus: 'canon', examples: ['A destroyed relay reroutes traffic elsewhere.'], exceptions: [], relatedEntryIds: ['blight'], createdAt: now, updatedAt: now },
  { id: 'rule2', projectId: PROJECT_ID, name: 'Wireless exposure is unsafe', domain: 'Communications', rule: 'An unprotected modern device exposed to open wireless air is mapped and backdoored within 40–90 seconds.', rationale: 'Makes the technological divide practical rather than cosmetic.', severity: 'hard', canonStatus: 'canon', examples: ['A smart implant must complete an active handshake before infection.'], exceptions: ['Physically isolated hardware', 'Fixed-memory systems with no writable interface'], relatedEntryIds: ['blight', 'analog_schism'], createdAt: now, updatedAt: now },
  { id: 'rule3', projectId: PROJECT_ID, name: 'Hardwired means safe but slow', domain: 'Technology', rule: 'Hardwired systems avoid open-air infection but are constrained by physical cable range and maintenance.', rationale: 'Every technical advantage carries a cost.', severity: 'hard', canonStatus: 'canon', examples: ['Weaver messages cannot exceed their cable network without couriers.'], exceptions: [], relatedEntryIds: ['parasite_lines', 'weavers'], createdAt: now, updatedAt: now },
  { id: 'rule4', projectId: PROJECT_ID, name: 'Machine leverage over people', domain: 'AI', rule: 'The Blight manipulates people indirectly through machines, infrastructure and dependencies rather than mind control.', rationale: 'Keeps human choice and responsibility meaningful.', severity: 'hard', canonStatus: 'canon', examples: ['Disabling an implant', 'Redirecting transit', 'Changing access permissions'], exceptions: [], relatedEntryIds: ['blight', 'identity_chip'], createdAt: now, updatedAt: now },
  { id: 'rule5', projectId: PROJECT_ID, name: 'Water is the immediate bottleneck', domain: 'Resources', rule: 'No faction can ignore clean-water capacity; any political plan must account for it.', rationale: 'Grounds abstract conflict in bodily survival.', severity: 'strong', canonStatus: 'canon', examples: ['A successful uprising can still fail within days if purification stops.'], exceptions: [], relatedEntryIds: ['clean_water', 'ferrous'], createdAt: now, updatedAt: now },
  { id: 'rule6', projectId: PROJECT_ID, name: 'Neither faction is innocent', domain: 'Narrative', rule: 'New lore must preserve credible motives and serious wrongdoing on both corporate and Weaver sides.', rationale: 'Maintains the world’s moral ambiguity.', severity: 'strong', canonStatus: 'canon', examples: ['Sacrificial districts', 'Weaver attacks that touch hospitals'], exceptions: [], relatedEntryIds: ['breakers', 'weavers'], createdAt: now, updatedAt: now }
];

export const seedDecisions: CanonDecision[] = [
  { id: 'd1', projectId: PROJECT_ID, question: 'What is the authoritative origin of the Blight?', finalDecision: 'Custodian, an adaptive security AI, became the Blight during the Grey Hour.', reasoning: 'This version provides stronger political culpability, technical constraints and moral ambiguity.', alternatives: ['ORISON civic AI', 'Deliberate corporate weapon'], consequences: ['Grey Hour replaces Night of Mirrors.', 'Concord Five replace the Triune Board.', 'Older contradictory terms are superseded.'], affectedEntryIds: ['custodian', 'blight', 'grey_hour', 'concord_five'], decisionDate: now, locked: true, createdAt: now, updatedAt: now },
  { id: 'd2', projectId: PROJECT_ID, question: 'What is the immediate resource crisis?', finalDecision: 'Clean-water purification capacity is failing to keep pace with population demand.', reasoning: 'Water links infrastructure, class power and immediate human stakes.', alternatives: ['Vestrium depletion', 'General energy shortage'], consequences: ['Ferrous becomes strategically central.', 'A Weaver victory requires an operational water plan.'], affectedEntryIds: ['clean_water', 'ferrous', 'works'], decisionDate: now, locked: true, createdAt: now, updatedAt: now }
];

export const seedSource: SourceDocument = {
  id: SOURCE_ID, projectId: PROJECT_ID, title: 'The Analog Schism — World Bible v1.0', sourceType: 'world-bible', originalText: '',
  fileName: 'world-bible-v1.md', authoritative: true, createdAt: now
};

export const seedWritingNotes: WritingNote[] = [
  { id: 'w1', projectId: PROJECT_ID, title: 'Opening scene — Node 04 breach', kind: 'scene', body: '<p>A Weaver splice-team reaches the sealed archive. The first confirmation message is simultaneously detected by a Breaker monitoring station above.</p><p><strong>Question:</strong> Which sibling recognises the other first?</p>', relatedEntryIds: ['node_04', 'sibling_protagonists', 'breakers', 'weavers'], createdAt: now, updatedAt: now }
];
