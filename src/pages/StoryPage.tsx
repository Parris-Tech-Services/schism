import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';
import type { GameState, Choice } from '../types/story';
import { applyEffects, getVisibleChoices } from '../services/storyEngine';
import { StoryTerminal } from '../components/StoryTerminal';
import { PageHeader } from '../components/PageHeader';

export function StoryPage() {
  const navigate = useNavigate();
  const data = useLiveQuery(async () => {
    const campaign = await db.campaigns.get('echoes_of_node_04');
    const scenes = await db.scenes.where('campaignId').equals('echoes_of_node_04').toArray();
    const saves = await db.saves.where('campaignId').equals('echoes_of_node_04').toArray();
    return { campaign, scenes, saves };
  }, []);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [commandLog, setCommandLog] = useState<{ text: string; isPlayer: boolean }[]>([]);

  // Initialize or load autosave
  useEffect(() => {
    if (!data?.campaign || gameState) return;
    const autosave = data.saves.find(s => s.saveName === 'Autosave');
    if (autosave) {
      setGameState(autosave);
    } else {
      setGameState({
        id: crypto.randomUUID(),
        saveName: 'Autosave',
        campaignId: data.campaign.id,
        currentSceneId: data.campaign.startingSceneId,
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

  // Autosave when state changes (debounced mildly by react render cycle)
  useEffect(() => {
    if (gameState) {
      void db.saves.put(gameState);
    }
  }, [gameState]);

  if (!data?.campaign || !gameState) {
    return <div className="p-8 text-center opacity-50">Loading Story Engine...</div>;
  }

  const currentScene = data.scenes.find(s => s.id === gameState.currentSceneId);
  
  if (!currentScene) {
    return <div className="p-8 text-red-500">Error: Scene {gameState.currentSceneId} not found.</div>;
  }

  // Inject visible choices properly
  const sceneWithVisibleChoices = {
    ...currentScene,
    choices: getVisibleChoices(currentScene.choices, gameState)
  };

  function handleChoice(choice: Choice) {
    if (!gameState) return;
    
    // Apply choice effects
    let newState = applyEffects(choice.effects, gameState);
    
    // Move to destination
    if (choice.destinationSceneId) {
      newState.currentSceneId = choice.destinationSceneId;
    }
    
    // Record history
    newState.decisionHistory = [...newState.decisionHistory, choice.id];
    newState.updatedAt = new Date().toISOString();
    
    setGameState(newState);
    setCommandLog([]); // clear log on room change
  }

  function handleCommand(cmd: string) {
    if (!gameState || !currentScene) return;
    const lowerCmd = cmd.toLowerCase().trim();
    
    const newLog = [...commandLog, { text: cmd, isPlayer: true }];
    
    let response = currentScene.commandResponses?.[lowerCmd];
    
    if (!response) {
      if (lowerCmd === 'look') {
        response = currentScene.narratorText;
      } else if (lowerCmd === 'inventory' || lowerCmd === 'inv') {
        response = gameState.inventory.length > 0 
          ? `Inventory: ${gameState.inventory.join(', ')}` 
          : 'Your inventory is empty.';
      } else if (lowerCmd === 'journal') {
        response = gameState.journalEntries.length > 0 
          ? gameState.journalEntries.map(j => `[${new Date(j.timestamp).toLocaleTimeString()}] ${j.text}`).join('\n')
          : 'Your journal is empty.';
      } else if (lowerCmd === 'objectives') {
        response = gameState.completedObjectives.length > 0 
          ? `Completed Objectives:\n${gameState.completedObjectives.join('\n')}` 
          : 'No objectives completed yet.';
      } else if (lowerCmd === 'status') {
        response = `Flags: ${gameState.flags.join(', ') || 'None'}`;
      } else if (lowerCmd === 'map') {
        response = `
    [ The Crown ]
          |
    [ Midstack  ]
          |
    [ The Works ]
          |
    [ Sub-Tiers ]

(Node 04 is located deep within the Works boundary)
`;
      } else if (lowerCmd === 'help') {
        response = 'Available commands: look, inventory, journal, objectives, status, help, save, load, restart. You can also make choices by clicking them.';
      } else if (lowerCmd === 'save') {
        handleSave();
        response = 'Game manually saved.';
      } else if (lowerCmd === 'load') {
        handleLoad();
        response = 'Loading last save...';
      } else if (lowerCmd === 'restart') {
        handleRestart();
        return;
      } else {
        response = `Command not recognized: "${cmd}". Type "help" for a list of common commands.`;
      }
    }
    
    newLog.push({ text: response, isPlayer: false });
    setCommandLog(newLog);
  }

  function handleSave() {
    if (!gameState) return;
    const saveState = { ...gameState, id: crypto.randomUUID(), saveName: `Manual Save - ${new Date().toLocaleString()}`, updatedAt: new Date().toISOString() };
    void db.saves.put(saveState);
    alert('Game saved.');
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
      setGameState(null); // will trigger the autosave initialization to start fresh
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
      />
    </div>
  );
}
