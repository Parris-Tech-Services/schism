import { useEffect, useMemo, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, ExternalLink, GitBranch, LockKeyhole, Save, Trash2, UnlockKeyhole } from 'lucide-react';
import { db } from '../db';
import { makeId } from '../lib/id';
import { PageHeader } from '../components/PageHeader';
import { RichTextEditor } from '../components/RichTextEditor';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { CanonStatus, LoreEntry } from '../types';

const statuses: CanonStatus[] = ['canon', 'provisional', 'draft', 'disputed', 'rumour', 'secret', 'superseded', 'rejected'];

function blankEntry(projectId: string, moduleTypeId: string): LoreEntry {
  const now = new Date().toISOString();
  return { id: makeId('entry'), projectId, moduleTypeId, title: '', summary: '', body: '', customFields: {}, canonStatus: 'draft', confidence: 60, tags: [], aliases: [], sourceIds: [], locked: false, spoilerLevel: 0, createdAt: now, updatedAt: now };
}

export function EntryEditorPage() {
  const { id } = useParams(); const navigate = useNavigate(); const isNew = !id;
  const data = useLiveQuery(async () => {
    const [project, modules, entries, relationships] = await Promise.all([db.projects.toCollection().first(), db.moduleTypes.toArray(), db.entries.toArray(), db.relationships.toArray()]);
    return { project, modules, entries, relationships };
  }, []);
  const source = id ? data?.entries.find((entry) => entry.id === id) : undefined;
  const [draft, setDraft] = useState<LoreEntry | null>(null); const [saved, setSaved] = useState(true); const [deleteOpen, setDeleteOpen] = useState(false); const [unlockOpen, setUnlockOpen] = useState(false);
  const saveTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!data?.project) return;
    setDraft(source ? structuredClone(source) : blankEntry(data.project.id, data.modules[0]?.id ?? 'terminology'));
    setSaved(true);
  }, [data?.project?.id, source?.id]);

  const connected = useMemo(() => data?.relationships.filter((relationship) => relationship.sourceId === draft?.id || relationship.targetId === draft?.id) ?? [], [data?.relationships, draft?.id]);
  const entryMap = new Map(data?.entries.map((entry) => [entry.id, entry]) ?? []);

  const update = <K extends keyof LoreEntry>(key: K, value: LoreEntry[K]) => {
    if (!draft || draft.locked) return;
    const next = { ...draft, [key]: value, updatedAt: new Date().toISOString() };
    setDraft(next); setSaved(false);
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => void save(next, true), 900);
  };

  async function save(record = draft, silent = false) {
    if (!record) return;
    if (!record.title.trim()) { if (!silent) alert('Give this lore entry a title first.'); return; }
    const existing = await db.entries.get(record.id);
    if (existing) await db.revisions.add({ id: makeId('rev'), projectId: record.projectId, entryId: record.id, snapshot: existing, reason: 'Autosave', createdAt: new Date().toISOString() });
    await db.entries.put(record); setSaved(true);
    if (isNew) navigate(`/entry/${record.id}`, { replace: true });
  }

  async function remove() {
    if (!draft) return;
    await db.transaction('rw', [db.entries, db.relationships], async () => {
      await db.entries.delete(draft.id);
      const ids = await db.relationships.filter((rel) => rel.sourceId === draft.id || rel.targetId === draft.id).primaryKeys();
      await db.relationships.bulkDelete(ids as string[]);
    });
    navigate('/library');
  }

  if (!data || !draft) return <div className="text-slate-500">Loading record…</div>;
  if (id && !source) return <div className="panel p-8"><h1 className="text-xl font-semibold text-white">Lore record not found</h1><Link to="/library" className="mt-4 inline-flex text-emerald-200">Return to library</Link></div>;

  return <>
    <PageHeader eyebrow={isNew ? 'New modular record' : 'Lore editor'} title={draft.title || 'Untitled lore'} description={draft.locked ? 'This canon record is locked. Unlock it explicitly before changing established facts.' : saved ? 'All changes saved locally.' : 'Saving changes to IndexedDB…'} actions={<><Link to="/library" className="button-secondary"><ArrowLeft size={16} /> Library</Link>{draft.locked ? <button className="button-secondary" onClick={() => setUnlockOpen(true)}><LockKeyhole size={16} /> Locked canon</button> : <button className="button-secondary" onClick={() => update('locked', true)}><UnlockKeyhole size={16} /> Lock canon</button>}<button className="button-primary" disabled={draft.locked} onClick={() => void save()}><Save size={16} /> Save</button></>} />

    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="panel p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]"><label><span className="eyebrow">Title</span><input className="input mt-2 text-lg font-semibold" disabled={draft.locked} value={draft.title} onChange={(e) => update('title', e.target.value)} placeholder="Name this person, place, event or idea" /></label><label><span className="eyebrow">Module type</span><select className="input mt-2" disabled={draft.locked} value={draft.moduleTypeId} onChange={(e) => update('moduleTypeId', e.target.value)}>{data.modules.map((module) => <option key={module.id} value={module.id}>{module.singular}</option>)}</select></label></div>
        <label className="mt-5 block"><span className="eyebrow">One-sentence summary</span><textarea className="input mt-2 min-h-24 resize-y" disabled={draft.locked} value={draft.summary} onChange={(e) => update('summary', e.target.value)} placeholder="The quickest accurate explanation of this record…" /></label>
        <div className="mt-5"><span className="eyebrow">Full lore</span><div className="mt-2 opacity-100">{draft.locked ? <div className="min-h-[280px] rounded-xl border border-white/10 bg-black/15 p-4 text-[15px] leading-7 text-slate-300" dangerouslySetInnerHTML={{ __html: draft.body }} /> : <RichTextEditor value={draft.body} onChange={(value) => update('body', value)} />}</div></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2"><label><span className="eyebrow">Tags</span><input className="input mt-2" disabled={draft.locked} value={draft.tags.join(', ')} onChange={(e) => update('tags', e.target.value.split(',').map((item) => item.trim()).filter(Boolean))} placeholder="core, technology, secret" /></label><label><span className="eyebrow">Aliases</span><input className="input mt-2" disabled={draft.locked} value={draft.aliases.join(', ')} onChange={(e) => update('aliases', e.target.value.split(',').map((item) => item.trim()).filter(Boolean))} placeholder="Other names or former terminology" /></label></div>
        <label className="mt-5 block"><span className="eyebrow">Private author notes</span><textarea className="input mt-2 min-h-28" disabled={draft.locked} value={draft.authorNotes ?? ''} onChange={(e) => update('authorNotes', e.target.value)} placeholder="Not exported into clean canon by default…" /></label>
      </section>

      <aside className="space-y-4">
        <section className="panel p-5"><p className="eyebrow">Canon control</p><div className="mt-3 flex items-center justify-between"><span className="text-sm text-slate-400">Current state</span><StatusBadge status={draft.canonStatus} /></div><select className="input mt-3" disabled={draft.locked} value={draft.canonStatus} onChange={(e) => update('canonStatus', e.target.value as CanonStatus)}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select><label className="mt-4 block text-xs text-slate-500">Author confidence: <span className="text-slate-300">{draft.confidence}%</span><input className="mt-2 w-full accent-emerald-300" type="range" min="0" max="100" disabled={draft.locked} value={draft.confidence} onChange={(e) => update('confidence', Number(e.target.value))} /></label><div className="mt-4 rounded-xl bg-white/[0.035] p-3 text-xs leading-5 text-slate-500">Secret truth means certain to the author but hidden in-world. Disputed means the author knows competing accounts exist.</div></section>

        <section className="panel p-5"><div className="flex items-center justify-between"><div><p className="eyebrow">Relationships</p><h2 className="mt-1 text-sm font-semibold text-white">{connected.length} connections</h2></div><GitBranch size={18} className="text-emerald-300/70" /></div><div className="mt-4 space-y-2">{connected.length === 0 ? <p className="text-xs leading-5 text-slate-500">No first-class relationships yet. Add them from the relationship map.</p> : connected.slice(0, 8).map((rel) => { const otherId = rel.sourceId === draft.id ? rel.targetId : rel.sourceId; const other = entryMap.get(otherId); return <Link to={`/entry/${otherId}`} key={rel.id} className="block rounded-xl border border-white/10 p-3 hover:bg-white/[0.04]"><div className="flex items-center justify-between gap-2"><span className="truncate text-sm text-slate-200">{other?.title ?? 'Missing entry'}</span><ExternalLink size={13} className="text-slate-600" /></div><div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300/60">{rel.type}</div></Link>; })}</div><Link to="/relationships" className="button-secondary mt-4 w-full"><GitBranch size={15} /> Manage connections</Link></section>

        <section className="panel p-5"><div className="flex items-center gap-2 text-sm text-slate-400"><Clock3 size={15} /> Updated {new Date(draft.updatedAt).toLocaleString()}</div>{!isNew && <button onClick={() => setDeleteOpen(true)} className="button-danger mt-4 w-full"><Trash2 size={16} /> Delete record</button>}</section>
      </aside>
    </div>

    <ConfirmDialog open={deleteOpen} title="Delete this lore record?" description="The entry and its relationships will be removed. Existing revision snapshots are retained." confirmLabel="Delete record" destructive onCancel={() => setDeleteOpen(false)} onConfirm={() => void remove()} />
    <ConfirmDialog open={unlockOpen} title="Unlock established canon?" description="This record was deliberately locked. Changes may alter dependent lore and should be reviewed in the contradiction centre." confirmLabel="Unlock record" onCancel={() => setUnlockOpen(false)} onConfirm={() => { setUnlockOpen(false); setDraft({ ...draft, locked: false }); setSaved(false); }} />
  </>;
}
