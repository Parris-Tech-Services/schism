import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { Filter, Grid2X2, List, Plus, Search } from 'lucide-react';
import { db } from '../db';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { DynamicIcon } from '../components/Icon';
import { excerpt } from '../lib/text';
import type { CanonStatus } from '../types';

export function LibraryPage() {
  const [query, setQuery] = useState(''); const [module, setModule] = useState('all'); const [status, setStatus] = useState<'all' | CanonStatus>('all'); const [view, setView] = useState<'grid' | 'list'>('grid');
  const data = useLiveQuery(async () => ({ entries: await db.entries.toArray(), modules: await db.moduleTypes.toArray() }), []);
  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.toLowerCase().trim();
    return data.entries.filter((entry) => (module === 'all' || entry.moduleTypeId === module) && (status === 'all' || entry.canonStatus === status) && (!q || `${entry.title} ${entry.summary} ${entry.tags.join(' ')} ${entry.aliases.join(' ')}`.toLowerCase().includes(q))).sort((a, b) => a.title.localeCompare(b.title));
  }, [data, module, query, status]);
  const moduleMap = new Map(data?.modules.map((item) => [item.id, item]) ?? []);
  return <>
    <PageHeader eyebrow="Structured world database" title="Lore Library" description="Filter, cross-reference and edit every established fact, draft, rumour and secret truth." actions={<Link to="/entry/new" className="button-primary"><Plus size={17} /> New lore entry</Link>} />
    <section className="panel mb-4 p-3"><div className="grid gap-3 lg:grid-cols-[1fr_220px_190px_auto]"><label className="relative"><Search size={17} className="absolute left-3 top-3 text-slate-500" /><input className="input pl-10" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search lore…" /></label><select className="input" value={module} onChange={(e) => setModule(e.target.value)}><option value="all">All module types</option>{data?.modules.map((item) => <option key={item.id} value={item.id}>{item.plural}</option>)}</select><select className="input" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}><option value="all">All canon states</option>{['canon','provisional','draft','disputed','rumour','secret','superseded','rejected'].map((item) => <option key={item} value={item}>{item}</option>)}</select><div className="flex rounded-xl border border-white/10 p-1"><button onClick={() => setView('grid')} className={`rounded-lg p-2 ${view === 'grid' ? 'bg-white/10 text-white' : 'text-slate-500'}`} aria-label="Grid view"><Grid2X2 size={17} /></button><button onClick={() => setView('list')} className={`rounded-lg p-2 ${view === 'list' ? 'bg-white/10 text-white' : 'text-slate-500'}`} aria-label="List view"><List size={17} /></button></div></div></section>
    <div className="mb-3 flex items-center justify-between text-xs text-slate-500"><span>{filtered.length} records</span><span className="flex items-center gap-1"><Filter size={13} /> Filters apply instantly</span></div>
    {view === 'grid' ? <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{filtered.map((entry) => { const type = moduleMap.get(entry.moduleTypeId); return <Link key={entry.id} to={`/entry/${entry.id}`} className="panel group p-4 transition hover:-translate-y-0.5 hover:border-emerald-300/20"><div className="flex items-start justify-between gap-3"><div className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04]" style={{ color: type?.colour }}><DynamicIcon name={type?.icon ?? 'Circle'} size={17} /></div><StatusBadge status={entry.canonStatus} /></div><h2 className="mt-4 font-semibold text-slate-100 group-hover:text-white">{entry.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{excerpt(entry.summary || entry.body, 180)}</p><div className="mt-4 flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">{type?.singular}</span><div className="flex gap-1">{entry.tags.slice(0,2).map((tag) => <span key={tag} className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-slate-500">{tag}</span>)}</div></div></Link>; })}</section> : <section className="panel overflow-hidden"><div className="divide-y divide-white/10">{filtered.map((entry) => { const type = moduleMap.get(entry.moduleTypeId); return <Link key={entry.id} to={`/entry/${entry.id}`} className="grid gap-3 px-4 py-3 hover:bg-white/[0.03] md:grid-cols-[1fr_170px_150px]"><div className="min-w-0"><div className="font-medium text-slate-200">{entry.title}</div><div className="mt-1 truncate text-xs text-slate-500">{entry.summary}</div></div><div className="flex items-center gap-2 text-sm text-slate-400"><DynamicIcon name={type?.icon ?? 'Circle'} size={15} style={{ color: type?.colour }} />{type?.singular}</div><div className="flex items-center md:justify-end"><StatusBadge status={entry.canonStatus} /></div></Link>; })}</div></section>}
    {filtered.length === 0 && <div className="panel p-12 text-center"><Search className="mx-auto text-slate-600" /><h2 className="mt-4 font-semibold text-white">No matching lore</h2><p className="mt-2 text-sm text-slate-500">Change the filters or create a new modular record.</p></div>}
  </>;
}
