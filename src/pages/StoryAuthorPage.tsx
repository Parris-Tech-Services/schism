import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Background, Controls, ReactFlow, type Edge, type Node } from '@xyflow/react';
import { db } from '../db';
import { PageHeader } from '../components/PageHeader';
import type { Scene, Campaign } from '../types/story';
import { Download, Upload, Copy, Play, CheckCircle, AlertTriangle } from 'lucide-react';
import { CommandTester } from '../components/CommandTester';

export function StoryAuthorPage() {
  const data = useLiveQuery(async () => {
    const campaigns = await db.campaigns.toArray();
    const scenes = await db.scenes.toArray();
    const entries = await db.entries.toArray();
    const maps = await db.storyMaps.toArray();
    const locations = await db.storyLocations.toArray();
    const exits = await db.storyExits.toArray();
    return { campaigns, scenes, entries, maps, locations, exits };
  }, []);

  const [activeCampaignId, setActiveCampaignId] = useState('echoes_of_node_04');
  const [validationLog, setValidationLog] = useState<string[]>([]);
  
  const campaign = data?.campaigns.find(c => c.id === activeCampaignId);
  const scenes = useMemo(() => data?.scenes.filter(s => s.campaignId === activeCampaignId) || [], [data, activeCampaignId]);
  const maps = data?.maps.filter(m => m.campaignId === activeCampaignId) || [];
  const locations = data?.locations.filter(l => l.campaignId === activeCampaignId) || [];
  const exits = data?.exits || [];

  const nodes: Node[] = useMemo(() => {
    return scenes.map((scene, i) => ({
      id: scene.id,
      position: { x: (i % 4) * 250, y: Math.floor(i / 4) * 150 },
      data: { label: scene.title || scene.id },
      style: { background: '#10201d', color: '#e8f3ef', border: '1px solid #445', padding: 10, borderRadius: 8, width: 200 }
    }));
  }, [scenes]);

  const edges: Edge[] = useMemo(() => {
    const e: Edge[] = [];
    scenes.forEach(scene => {
      scene.choices.forEach(choice => {
        if (choice.destinationSceneId) {
          e.push({
            id: `${scene.id}-${choice.id}`,
            source: scene.id,
            target: choice.destinationSceneId,
            label: choice.label,
            style: { stroke: '#4a7568' },
            animated: true
          });
        }
      });
    });
    return e;
  }, [scenes]);

  function runValidation() {
    if (!campaign) return;
    const logs: string[] = [];
    
    // Check missing starting scene
    if (!scenes.find(s => s.id === campaign.startingSceneId)) {
      logs.push(`ERROR: Starting scene '${campaign.startingSceneId}' not found.`);
    }

    const reachable = new Set<string>();
    const toVisit = [campaign.startingSceneId];
    
    while(toVisit.length > 0) {
      const current = toVisit.pop()!;
      if (!reachable.has(current)) {
        reachable.add(current);
        const scene = scenes.find(s => s.id === current);
        if (scene) {
          scene.choices.forEach(c => {
            if (c.destinationSceneId) toVisit.push(c.destinationSceneId);
          });
        }
      }
    }

    // Duplicate Scene IDs
    const seenIds = new Set<string>();
    scenes.forEach(scene => {
      if (seenIds.has(scene.id)) logs.push(`ERROR: Duplicate scene ID '${scene.id}'.`);
      seenIds.add(scene.id);
      
      if (!reachable.has(scene.id)) logs.push(`WARNING: Scene '${scene.id}' is unreachable.`);
      if (scene.choices.length === 0 && !(scene.tags || []).includes('ending') && !campaign.endings.find(e => e.id === scene.id)) {
        logs.push(`WARNING: Scene '${scene.id}' has no exits and is not marked as an ending.`);
      }

      // Check lore entry references
      if (scene.locationEntryId && !data?.entries.find(e => e.id === scene.locationEntryId)) {
        logs.push(`ERROR: Scene '${scene.id}' references missing location entry '${scene.locationEntryId}'.`);
      }
      (scene.discoveredLoreIds || []).forEach(loreId => {
        if (!data?.entries.find(e => e.id === loreId)) {
          logs.push(`ERROR: Scene '${scene.id}' references missing discovered lore '${loreId}'.`);
        }
      });

      scene.choices.forEach(c => {
        if (c.destinationSceneId && !scenes.find(s => s.id === c.destinationSceneId)) {
          logs.push(`ERROR: Scene '${scene.id}' choice '${c.id}' points to missing destination '${c.destinationSceneId}'.`);
        }
      });
    });

    // MAP VALIDATION
    const mapIds = new Set<string>();
    maps.forEach(m => {
      if (mapIds.has(m.id)) logs.push(`ERROR: Duplicate map ID '${m.id}'.`);
      mapIds.add(m.id);
    });

    const locIds = new Set<string>();
    locations.forEach(l => {
      if (locIds.has(l.id)) logs.push(`ERROR: Duplicate location ID '${l.id}'.`);
      locIds.add(l.id);
      
      if (!maps.find(m => m.id === l.mapId)) logs.push(`ERROR: Location '${l.id}' references missing map '${l.mapId}'.`);
      
      if (l.entrySceneId && !scenes.find(s => s.id === l.entrySceneId)) {
         logs.push(`ERROR: Location '${l.id}' references missing scene '${l.entrySceneId}'.`);
      }
      
      if (l.linkedLoreEntryId && !data?.entries.find(e => e.id === l.linkedLoreEntryId)) {
         logs.push(`ERROR: Location '${l.id}' references missing lore entry '${l.linkedLoreEntryId}'.`);
      }

      // Find exits from this location
      const locExits = exits.filter(e => e.sourceLocationId === l.id);
      const dirs = new Set<string>();
      locExits.forEach(e => {
         if (dirs.has(e.direction)) {
            logs.push(`ERROR: Location '${l.id}' has multiple exits in direction '${e.direction}'.`);
         }
         dirs.add(e.direction);
         if (!locations.find(dest => dest.id === e.destinationLocationId)) {
            logs.push(`ERROR: Exit '${e.id}' points to missing destination '${e.destinationLocationId}'.`);
         }
         
         // Check reverse exits for one-way logic if we wanted to be strict
         const reverse = exits.find(rev => rev.sourceLocationId === e.destinationLocationId && rev.destinationLocationId === l.id);
         if (!reverse) {
            logs.push(`WARNING: Route '${e.sourceLocationId}' to '${e.destinationLocationId}' is one-way. Ensure this is intentional.`);
         }
      });
    });

    if (logs.length === 0) logs.push("SUCCESS: Campaign passed all validation checks.");
    setValidationLog(logs);
  }

  function exportCampaign() {
    if (!campaign) return;
    const exportData = { campaign, scenes };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaign.id}_export.json`;
    a.click();
  }

  async function duplicateScene(scene: Scene) {
    const newId = `${scene.id}_copy_${Date.now()}`;
    const newScene = { ...scene, id: newId, title: `${scene.title} (Copy)` };
    await db.scenes.add(newScene);
  }

  return (
    <>
      <PageHeader 
        eyebrow="Story Mode Tools" 
        title="Campaign Authoring" 
        description="Design scenes, choices, and validate narrative flows." 
        actions={
          <div className="flex gap-2">
            <button onClick={exportCampaign} className="button-secondary"><Download size={16} /> Export JSON</button>
            <button onClick={runValidation} className="button-primary"><CheckCircle size={16} /> Validate Flow</button>
          </div>
        } 
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-4">
          <section className="panel h-[400px] overflow-hidden">
            <ReactFlow nodes={nodes} edges={edges} fitView>
              <Background color="#1a302b" gap={22} />
              <Controls />
            </ReactFlow>
          </section>
          
          <section className="panel p-4">
            <h2 className="eyebrow mb-4">Scene Editor (Read-Only Preview)</h2>
            <div className="space-y-4">
              {scenes.slice(0, 5).map(scene => (
                <div key={scene.id} className="border border-white/10 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{scene.title}</h3>
                    <p className="text-xs text-slate-400">ID: {scene.id} | Choices: {scene.choices.length}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => duplicateScene(scene)} className="p-2 hover:bg-white/10 rounded" title="Duplicate"><Copy size={16} /></button>
                    <button className="p-2 hover:bg-white/10 rounded" title="Preview"><Play size={16} /></button>
                  </div>
                </div>
              ))}
              <p className="text-xs text-slate-500 italic mt-4">* Full form-based editing UI omitted for brevity in MVP. Use JSON export/import for complex bulk edits.</p>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <section className="panel p-4 h-full">
            <h2 className="eyebrow mb-4">Validation Logs</h2>
            {validationLog.length === 0 ? (
              <p className="text-slate-500 text-sm">Run validation to check for broken links and logic errors.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {validationLog.map((log, i) => (
                  <li key={i} className={log.startsWith('ERROR') ? 'text-red-400' : log.startsWith('WARNING') ? 'text-amber-400' : 'text-emerald-400'}>
                    {log}
                  </li>
                ))}
              </ul>
            )}
          </section>
          
          <CommandTester />
        </div>
      </div>
    </>
  );
}
