import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { Background, Controls, MarkerType, MiniMap, ReactFlow, type Edge, type Node } from '@xyflow/react';
import { GitBranch, Plus, X } from 'lucide-react';
import { db } from '../db';
import { makeId } from '../lib/id';
import { PageHeader } from '../components/PageHeader';
import { validateRelationship } from '../services/contradictions';
import type { CanonStatus, Relationship } from '../types';

export function RelationshipsPage() {
  const data = useLiveQuery(async () => ({ entries: await db.entries.toArray(), relationships: await db.relationships.toArray(), modules: await db.moduleTypes.toArray() }), []);
  const navigate = useNavigate();
  const [moduleFilter, setModuleFilter] = useState('all'); const [focus, setFocus] = useState('all'); const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ sourceId: '', targetId: '', type: 'relates to', description: '', canonStatus: 'canon' as CanonStatus });
  const moduleMap = new Map(data?.modules.map((module) => [module.id, module]) ?? []);
  const visibleIds = useMemo(() => {
    if (!data) return new Set<string>();
    if (focus !== 'all') {
      const ids = new Set([focus]); data.relationships.forEach((rel) => { if (rel.sourceId === focus) ids.add(rel.targetId); if (rel.targetId === focus) ids.add(rel.sourceId); }); return ids;
    }
    return new Set(data.entries.filter((entry) => moduleFilter === 'all' || entry.moduleTypeId === moduleFilter).map((entry) => entry.id));
  }, [data, focus, moduleFilter]);
  const nodes: Node[] = useMemo(() => (data?.entries.filter((entry) => visibleIds.has(entry.id)).map((entry, index) => { const angle = (index / Math.max(1, visibleIds.size)) * Math.PI * 2; const radius = Math.max(220, visibleIds.size * 13); const type = moduleMap.get(entry.moduleTypeId); return { id: entry.id, position: { x: 470 + Math.cos(angle) * radius, y: 350 + Math.sin(angle) * radius }, data: { label: entry.title }, style: { background: '#10201d', color: '#e8f3ef', border: `1px solid ${type?.colour ?? '#445'}`, borderRadius: 12, padding: 10, width: 160, fontSize: 12 } }; }) ?? []), [data?.entries, visibleIds, moduleMap]);
  const edges: Edge[] = useMemo(() => data?.relationships.filter((rel) => visibleIds.has(rel.sourceId) && visibleIds.has(rel.targetId)).map((rel) => ({ id: rel.id, source: rel.sourceId, target: rel.targetId, label: rel.type, animated: rel.canonStatus === 'secret', style: { stroke: rel.canonStatus === 'secret' ? '#fb7185' : '#4a7568' }, labelStyle: { fill: '#a7b8b3', fontSize: 9 }, markerEnd: rel.direction === 'directed' ? { type: MarkerType.ArrowClosed } : undefined })) ?? [], [data?.relationships, visibleIds]);
  async function addRelationship() {
    const error = validateRelationship(form); if (error) return alert(error);
    const now = new Date().toISOString(); const record: Relationship = { id: makeId('rel'), projectId: 'project_analog_schism', ...form, direction: 'directed', sourceIds: [], spoilerLevel: 0, createdAt: now, updatedAt: now };
    await db.relationships.add(record); setOpen(false); setForm({ sourceId: '', targetId: '', type: 'relates to', description: '', canonStatus: 'canon' });
  }
  return <>
    <PageHeader eyebrow="First-class relationship records" title="Faction & Relationship Map" description="Explore focused neighbourhoods instead of an unreadable everything-at-once graph." actions={<button onClick={() => setOpen(true)} className="button-primary"><Plus size={17} /> Add relationship</button>} />
    <section className="panel mb-4 grid gap-3 p-3 lg:grid-cols-[220px_1fr]"><select className="input" value={moduleFilter} onChange={(e) => { setModuleFilter(e.target.value); setFocus('all'); }}><option value="all">All module types</option>{data?.modules.map((module) => <option key={module.id} value={module.id}>{module.plural}</option>)}</select><select className="input" value={focus} onChange={(e) => setFocus(e.target.value)}><option value="all">No focal entry</option>{data?.entries.sort((a,b) => a.title.localeCompare(b.title)).map((entry) => <option key={entry.id} value={entry.id}>Focus: {entry.title}</option>)}</select></section>
    <section className="panel h-[680px] overflow-hidden"><ReactFlow nodes={nodes} edges={edges} fitView onNodeClick={(_, node) => navigate(`/entry/${node.id}`)} minZoom={0.2} maxZoom={1.8}><Background color="#1a302b" gap={22} /><Controls /><MiniMap pannable zoomable nodeColor="#245a49" maskColor="rgba(7,17,15,.72)" /></ReactFlow></section>
    <p className="mt-3 text-xs text-slate-600">Showing {nodes.length} entries and {edges.length} visible relationships. Secret-truth edges are highlighted and animated.</p>
    {open && <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4"><div className="panel w-full max-w-xl p-5"><div className="flex items-center justify-between"><div><p className="eyebrow">New graph edge</p><h2 className="mt-1 text-xl font-semibold text-white">Add relationship</h2></div><button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white"><X /></button></div><div className="mt-5 space-y-3"><select className="input" value={form.sourceId} onChange={(e) => setForm({ ...form, sourceId: e.target.value })}><option value="">Source entry…</option>{data?.entries.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}</select><input className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="controls, opposes, created…" /><select className="input" value={form.targetId} onChange={(e) => setForm({ ...form, targetId: e.target.value })}><option value="">Target entry…</option>{data?.entries.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}</select><textarea className="input min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Why does this relationship matter?" /><select className="input" value={form.canonStatus} onChange={(e) => setForm({ ...form, canonStatus: e.target.value as CanonStatus })}>{['canon','provisional','draft','disputed','rumour','secret'].map((s) => <option key={s} value={s}>{s}</option>)}</select></div><div className="mt-6 flex justify-end gap-2"><button className="button-secondary" onClick={() => setOpen(false)}>Cancel</button><button className="button-primary" onClick={() => void addRelationship()}><GitBranch size={16} /> Create link</button></div></div></div>}
  </>;
}
