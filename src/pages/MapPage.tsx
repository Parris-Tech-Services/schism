import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { Background, Controls, MarkerType, MiniMap, ReactFlow, type Edge, type Node } from '@xyflow/react';
import { db } from '../db';
import { PageHeader } from '../components/PageHeader';
import type { CanonStatus } from '../types';
import { Map as MapIcon, Plus } from 'lucide-react';

export function MapPage() {
  const data = useLiveQuery(async () => {
    const entries = await db.entries.where('moduleTypeId').equals('map_node').toArray();
    const relationships = await db.relationships.toArray();
    const modules = await db.moduleTypes.toArray();
    return { entries, relationships, modules };
  }, []);

  const navigate = useNavigate();

  // Status toggles
  const [showCanon, setShowCanon] = useState(true);
  const [showProvisional, setShowProvisional] = useState(true);
  const [showInWorld, setShowInWorld] = useState(false);
  const [showSuperseded, setShowSuperseded] = useState(false);

  // Derive visible status list
  const visibleStatuses = useMemo(() => {
    const statuses = new Set<CanonStatus>();
    if (showCanon) statuses.add('canon');
    if (showProvisional) statuses.add('provisional');
    if (showInWorld) {
      statuses.add('disputed');
      statuses.add('rumour');
    }
    if (showSuperseded) statuses.add('superseded');
    // Secret might be tracked separately, but let's include it in canon for simplicity
    if (showCanon) statuses.add('secret');
    return statuses;
  }, [showCanon, showProvisional, showInWorld, showSuperseded]);

  const visibleNodes = useMemo(() => {
    if (!data) return [];
    return data.entries.filter(entry => visibleStatuses.has(entry.canonStatus));
  }, [data, visibleStatuses]);

  const visibleIds = useMemo(() => new Set(visibleNodes.map(e => e.id)), [visibleNodes]);

  const getStatusColor = (status: CanonStatus) => {
    switch (status) {
      case 'canon':
      case 'secret': return '#10b981'; // emerald-500
      case 'provisional': return '#3b82f6'; // blue-500
      case 'disputed':
      case 'rumour': return '#f59e0b'; // amber-500
      case 'superseded': return '#64748b'; // slate-500
      default: return '#10b981';
    }
  };

  const getStatusBg = (status: CanonStatus) => {
    switch (status) {
      case 'canon':
      case 'secret': return '#10201d'; 
      case 'provisional': return '#101c2e'; 
      case 'disputed':
      case 'rumour': return '#2e1c08'; 
      case 'superseded': return '#1a1f26'; 
      default: return '#10201d';
    }
  };

  const nodes: Node[] = useMemo(() => {
    return visibleNodes.map((entry) => {
      const x = Number(entry.customFields.coordinateX ?? 0);
      const y = Number(entry.customFields.coordinateY ?? 0);
      const labelOverride = entry.customFields.mapLabelOverride as string;
      const label = labelOverride || entry.title;
      const layer = entry.customFields.mapLayer as string;
      
      const borderColor = getStatusColor(entry.canonStatus);
      const bg = getStatusBg(entry.canonStatus);
      
      return {
        id: entry.id,
        position: { x, y },
        data: { label: `${label}${layer ? ` (${layer})` : ''}` },
        style: {
          background: bg,
          color: '#e8f3ef',
          border: `2px solid ${borderColor}`,
          borderRadius: 12,
          padding: 10,
          minWidth: 120,
          textAlign: 'center' as const,
          fontSize: 12,
          boxShadow: `0 0 10px ${borderColor}40`
        }
      };
    });
  }, [visibleNodes]);

  const edges: Edge[] = useMemo(() => {
    if (!data) return [];
    // Only show edges between visible map nodes
    return data.relationships
      .filter(rel => visibleIds.has(rel.sourceId) && visibleIds.has(rel.targetId) && visibleStatuses.has(rel.canonStatus))
      .map(rel => {
        const isDisputed = rel.canonStatus === 'disputed' || rel.canonStatus === 'rumour';
        const color = getStatusColor(rel.canonStatus);
        
        return {
          id: rel.id,
          source: rel.sourceId,
          target: rel.targetId,
          label: rel.type,
          animated: isDisputed,
          style: { stroke: color, strokeWidth: 2, strokeDasharray: isDisputed ? '5,5' : 'none' },
          labelStyle: { fill: '#a7b8b3', fontSize: 9 },
          markerEnd: rel.direction === 'directed' ? { type: MarkerType.ArrowClosed, color } : undefined
        };
      });
  }, [data, visibleIds, visibleStatuses]);

  return <>
    <PageHeader 
      eyebrow="Modular mapping system" 
      title="Geographic Node Map" 
      description="View the spatial layout of map nodes across the city, including provisional ideas and in-world claims." 
      actions={
        <button onClick={() => navigate('/entry/new')} className="button-primary">
          <Plus size={17} /> Add Location
        </button>
      } 
    />
    
    <section className="panel mb-4 grid gap-3 p-3 md:grid-cols-4">
      <label className="flex items-center gap-2 cursor-pointer rounded-xl p-2 hover:bg-white/[.04]">
        <input type="checkbox" className="accent-emerald-500" checked={showCanon} onChange={(e) => setShowCanon(e.target.checked)} />
        <span className="text-sm text-emerald-200">Canonical Geography</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer rounded-xl p-2 hover:bg-white/[.04]">
        <input type="checkbox" className="accent-blue-500" checked={showProvisional} onChange={(e) => setShowProvisional(e.target.checked)} />
        <span className="text-sm text-blue-200">Provisional Ideas</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer rounded-xl p-2 hover:bg-white/[.04]">
        <input type="checkbox" className="accent-amber-500" checked={showInWorld} onChange={(e) => setShowInWorld(e.target.checked)} />
        <span className="text-sm text-amber-200">In-World Claims</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer rounded-xl p-2 hover:bg-white/[.04]">
        <input type="checkbox" className="accent-slate-500" checked={showSuperseded} onChange={(e) => setShowSuperseded(e.target.checked)} />
        <span className="text-sm text-slate-300">Superseded Map Data</span>
      </label>
    </section>

    <section className="panel h-[680px] overflow-hidden">
      {nodes.length > 0 ? (
        <ReactFlow nodes={nodes} edges={edges} fitView onNodeClick={(_, node) => navigate(`/entry/${node.id}`)} minZoom={0.1} maxZoom={2}>
          <Background color="#1a302b" gap={30} size={2} />
          <Controls />
          <MiniMap pannable zoomable nodeColor="#245a49" maskColor="rgba(7,17,15,.72)" />
        </ReactFlow>
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-slate-500">
          <MapIcon size={48} className="mb-4 opacity-50" />
          <p>No map nodes match the current filters.</p>
          <p className="mt-2 text-xs">Create a new lore entry and set its type to "Map Node".</p>
        </div>
      )}
    </section>
  </>;
}
