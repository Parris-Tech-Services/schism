import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';
import type { GameState, Choice, StoryLocation, StoryExit, StoryMap, StoryInteractable } from '../types/story';
import { applyEffects, getVisibleChoices, attemptMovement, resolveInteractable } from '../services/storyEngine';
import { parseCommand, findBestMatch } from '../services/commandParser';
import { resolveVerb, COMMAND_REGISTRY } from '../services/commandRegistry';
import { StoryTerminal } from '../components/StoryTerminal';

export function StoryPage() {
  const navigate = useNavigate();
  const data = useLiveQuery(async () => {
    const campaign = await db.campaigns.get('echoes_of_node_04');
    const scenes = await db.scenes.where('campaignId').equals('echoes_of_node_04').toArray();
    const saves = await db.saves.where('campaignId').equals('echoes_of_node_04').toArray();
    const maps = await db.storyMaps.where('campaignId').equals('echoes_of_node_04').toArray();
    const locations = await db.storyLocations.where('campaignId').equals('echoes_of_node_04').toArray();
    const exits = await db.storyExits.toArray();
    const interactables = await db.storyInteractables.toArray();
    return { campaign, scenes, saves, maps, locations, exits, interactables };
  }, []);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [commandLog, setCommandLog] = useState<{ text: string; isPlayer: boolean; type?: 'error'|'success'|'normal' }[]>([]);

  // Initialize or load autosave
  useEffect(() => {
    if (!data?.campaign || gameState) return;
    const autosave = data.saves.find(s => s.saveName === 'Autosave');
    if (autosave) {
      // V2 to V3 migration injection safely
      if (!autosave.visitedLocationIds) autosave.visitedLocationIds = [];
      if (!autosave.discoveredLocationIds) autosave.discoveredLocationIds = [];
      if (!autosave.revealedExitIds) autosave.revealedExitIds = [];
      if (!autosave.unlockedExitIds) autosave.unlockedExitIds = [];
      
      if (!autosave.currentLocationId) {
         // Try to find a location matching current scene
         const loc = data.locations.find(l => l.entrySceneId === autosave.currentSceneId);
         if (loc) autosave.currentLocationId = loc.id;
      }
      setGameState(autosave);
    } else {
      setGameState({
        id: crypto.randomUUID(),
        saveName: 'Autosave',
        campaignId: data.campaign.id,
        currentSceneId: data.campaign.startingSceneId,
        currentLocationId: undefined, // Let the choice handle initial placement
        visitedLocationIds: [],
        discoveredLocationIds: [],
        revealedExitIds: [],
        unlockedExitIds: [],
        mapNotes: {},
        playerCharacterId: '',
        inventory: [],
        flags: [],
        variables: {},
        relationshipValues: {},
        discoveredLoreIds: [],
        completedObjectives: [],
        journalEntries: [],
        decisionHistory: [],
        campaignVersion: data.campaign.version,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }, [data, gameState]);

  // Autosave when state changes
  useEffect(() => {
    if (gameState) {
      void db.saves.put(gameState);
    }
  }, [gameState]);

  if (!data?.campaign || !gameState) {
    return <div className="p-8 text-center opacity-50">Loading Story Engine...</div>;
  }

  const currentScene = data.scenes.find(s => s.id === gameState.currentSceneId);
  const currentLocation = data.locations.find(l => l.id === gameState.currentLocationId);
  const currentMap = data.maps.find(m => m.id === currentLocation?.mapId);
  const locationExits = currentLocation ? data.exits.filter(e => e.sourceLocationId === currentLocation.id) : [];
  const locationInteractables = currentLocation ? data.interactables.filter(i => i.locationId === currentLocation.id && (!i.hidden || gameState.flags.includes(`found_${i.id}`))) : [];

  const sceneWithVisibleChoices = currentScene ? {
    ...currentScene,
    choices: getVisibleChoices(currentScene.choices, gameState)
  } : undefined;

  function appendLog(text: string, isPlayer: boolean, type: 'normal'|'error'|'success' = 'normal') {
    setCommandLog(prev => [...prev, { text, isPlayer, type }]);
  }

  function handleChoice(choice: Choice) {
    if (!gameState) return;
    let newState = applyEffects(choice.effects, gameState);
    if (choice.destinationSceneId) {
      newState.currentSceneId = choice.destinationSceneId;
      // See if we also move location
      const newLoc = data?.locations.find(l => l.entrySceneId === choice.destinationSceneId);
      if (newLoc) {
        newState.currentLocationId = newLoc.id;
        if (!newState.visitedLocationIds.includes(newLoc.id)) {
          newState.visitedLocationIds = [...newState.visitedLocationIds, newLoc.id];
        }
      }
    }
    newState.decisionHistory = [...newState.decisionHistory, choice.id];
    newState.updatedAt = new Date().toISOString();
    setGameState(newState);
    setCommandLog([]); // clear log on scene change
  }

  function handleCommand(cmdRaw: string) {
    if (!gameState) return;
    const parsed = parseCommand(cmdRaw);
    appendLog(cmdRaw, true);

    const cmdDef = resolveVerb(parsed.verb);
    if (!cmdDef) {
       // Fuzzy matching for typos
       const allVerbs = COMMAND_REGISTRY.map(c => c.canonicalName).concat(COMMAND_REGISTRY.flatMap(c => c.aliases));
       const match = findBestMatch(parsed.verb, allVerbs, 2);
       if (match) {
         appendLog(`Did you mean "${match}"?`, false, 'error');
       } else {
         appendLog(`Command not recognized: "${parsed.verb}". Type "help" for a list of common commands.`, false, 'error');
       }
       return;
    }

    if (cmdDef.category === 'system') {
      executeSystemCommand(cmdDef.canonicalName);
      return;
    }
    
    if (cmdDef.category === 'info') {
      executeInfoCommand(cmdDef.canonicalName);
      return;
    }

    if (!currentLocation) {
       appendLog("You cannot do that right now.", false, 'error');
       return;
    }

    if (cmdDef.category === 'navigation') {
      executeNavigationCommand(cmdDef.canonicalName, parsed);
    } else if (cmdDef.category === 'observation') {
      executeObservationCommand(cmdDef.canonicalName, parsed);
    } else if (cmdDef.category === 'interaction') {
      executeInteractionCommand(cmdDef.canonicalName, parsed);
    }
  }

  function executeSystemCommand(cmdName: string) {
    if (cmdName === 'save') {
      handleSave();
      appendLog('Game manually saved.', false, 'success');
    } else if (cmdName === 'load') {
      handleLoad();
    } else if (cmdName === 'restart') {
      handleRestart();
    } else if (cmdName === 'clear') {
      setCommandLog([]);
    } else if (cmdName === 'help') {
      appendLog('Available commands: north, south, east, west, look, examine [object], take [object], inventory, journal, status, save, load, restart, clear.', false);
    }
  }

  function executeInfoCommand(cmdName: string) {
    if (cmdName === 'inventory') {
      appendLog(gameState!.inventory.length > 0 ? `Inventory: ${gameState!.inventory.join(', ')}` : 'Your inventory is empty.', false);
    } else if (cmdName === 'journal') {
      appendLog(gameState!.journalEntries.length > 0 ? gameState!.journalEntries.map(j => `[${new Date(j.timestamp).toLocaleTimeString()}] ${j.text}`).join('\n') : 'Your journal is empty.', false);
    } else if (cmdName === 'objectives') {
      appendLog(gameState!.completedObjectives.length > 0 ? `Completed Objectives:\n${gameState!.completedObjectives.join('\n')}` : 'No objectives completed yet.', false);
    } else if (cmdName === 'status') {
      // Clean readable status
      const charName = gameState?.playerCharacterId.replace('_', ' ').toUpperCase();
      appendLog(`Route: ${charName}\nLocation: ${currentLocation?.title || 'Unknown'}\nChapter State: ${gameState!.flags.some(f => f.startsWith('ENDING_')) ? 'Completed' : 'Active'}`, false);
    } else if (cmdName === 'codex') {
       appendLog(gameState!.discoveredLoreIds.length > 0 ? `Discovered Lore: ${gameState!.discoveredLoreIds.join(', ')}` : 'No lore discovered yet.', false);
    }
  }

  function executeNavigationCommand(cmdName: string, parsed: any) {
    if (['north', 'south', 'east', 'west', 'up', 'down'].includes(cmdName)) {
      const moveResult = attemptMovement(cmdName, currentLocation!.id, gameState!, locationExits);
      if (!moveResult.success) {
         appendLog(moveResult.message || "You cannot go that way.", false, 'error');
         return;
      }
      
      // Execute Movement
      let newState = { ...gameState! };
      if (moveResult.effects) newState = applyEffects(moveResult.effects, newState);
      
      const destLocId = moveResult.newLocationId!;
      newState.currentLocationId = destLocId;
      if (!newState.visitedLocationIds.includes(destLocId)) {
        newState.visitedLocationIds = [...newState.visitedLocationIds, destLocId];
      }
      // Discover adjacencies
      const newExits = data!.exits.filter(e => e.sourceLocationId === destLocId);
      for (const e of newExits) {
        if (!newState.discoveredLocationIds.includes(e.destinationLocationId)) {
           newState.discoveredLocationIds = [...newState.discoveredLocationIds, e.destinationLocationId];
        }
      }
      
      // Trigger scene if applicable
      const destLoc = data!.locations.find(l => l.id === destLocId);
      if (destLoc?.entrySceneId) {
         newState.currentSceneId = destLoc.entrySceneId;
      } else {
         newState.currentSceneId = ''; // Clear scene context if wandering freely
      }

      setGameState(newState);
      setCommandLog([]);
    } else if (cmdName === 'map' || cmdName === 'map region' || cmdName === 'map city') {
       appendLog("Check the utility panel on the right for the map view.", false);
    } else if (cmdName === 'exits') {
       appendLog(`Known exits: ${locationExits.map(e => e.direction).join(', ') || 'None'}.`, false);
    }
  }

  function executeObservationCommand(cmdName: string, parsed: any) {
    if (cmdName === 'look') {
      appendLog(currentLocation!.description + (locationInteractables.length > 0 ? '\n\nYou see: ' + locationInteractables.map(i => i.title).join(', ') : ''), false);
    } else if (cmdName === 'examine' || cmdName === 'read' || cmdName === 'search' || cmdName === 'listen') {
      if (!parsed.directObject) {
         appendLog(`What do you want to ${cmdName}?`, false, 'error');
         return;
      }
      const interactable = resolveInteractable(parsed.directObject, locationInteractables);
      if (!interactable) {
         appendLog(`There is no visible ${parsed.directObject} here.`, false, 'error');
         return;
      }
      const interaction = (interactable.interactions || []).find(i => i.verb === cmdName);
      if (interaction) {
         executeInteraction(interactable, interaction);
      } else {
         appendLog(interactable.description, false); // Fallback to generic description
      }
    }
  }

  function executeInteractionCommand(cmdName: string, parsed: any) {
     if (!parsed.directObject) {
         appendLog(`What do you want to ${cmdName}?`, false, 'error');
         return;
     }
     const interactable = resolveInteractable(parsed.directObject, locationInteractables);
     if (!interactable) {
        // Check inventory interactions later
        appendLog(`There is no visible ${parsed.directObject} here.`, false, 'error');
        return;
     }
     const interaction = (interactable.interactions || []).find(i => i.verb === cmdName);
     if (interaction) {
        executeInteraction(interactable, interaction);
     } else {
        appendLog(`You cannot ${cmdName} the ${interactable.title}.`, false, 'error');
     }
  }

  function executeInteraction(interactable: StoryInteractable, interaction: any) {
     // Check requirements
     if (interaction.requirements) {
         // Need a manual evaluate here or just assume we add it to engine
     }
     if (interaction.onceOnly && gameState!.flags.includes(`interacted_${interactable.id}_${interaction.verb}`)) {
         appendLog("You have already done that.", false, 'error');
         return;
     }
     
     let newState = { ...gameState! };
     if (interaction.effects) {
         newState = applyEffects(interaction.effects, newState);
     }
     if (interaction.onceOnly) {
         newState.flags = [...newState.flags, `interacted_${interactable.id}_${interaction.verb}`];
     }
     
     appendLog(interaction.successText || "Done.", false, 'success');
     setGameState(newState);
  }

  function handleSave() {
    if (!gameState) return;
    const saveState = { ...gameState, id: crypto.randomUUID(), saveName: `Manual Save - ${new Date().toLocaleString()}`, updatedAt: new Date().toISOString() };
    void db.saves.put(saveState);
  }

  function handleLoad() {
    if (!data?.saves) return;
    const manualSaves = data.saves.filter(s => s.saveName !== 'Autosave').sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    if (manualSaves.length > 0) {
      if (confirm('Load most recent manual save?')) {
        setGameState(manualSaves[0]);
        setCommandLog([]);
      }
    } else {
      alert('No manual saves found.');
    }
  }

  function handleRestart() {
    if (confirm('Are you sure you want to restart this chapter?')) {
      setGameState(null);
      void db.saves.where('saveName').equals('Autosave').delete();
    }
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] w-full bg-[#0a1210] p-0 md:h-[calc(100vh-theme(spacing.24))]">
      <StoryTerminal 
        scene={sceneWithVisibleChoices} 
        gameState={gameState} 
        onChoice={handleChoice} 
        onCommand={handleCommand}
        commandLog={commandLog}
        onSave={handleSave}
        onLoad={handleLoad}
        onRestart={handleRestart}
        currentLocation={currentLocation}
        currentMap={currentMap}
        exits={locationExits}
      />
    </div>
  );
}
