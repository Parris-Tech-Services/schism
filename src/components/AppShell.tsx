import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Activity, BookOpen, BrainCircuit, Cable, ChevronsLeft, CircleHelp, Clock3, DatabaseBackup, FilePenLine, GitBranch,
  LayoutDashboard, Library, Map, Menu, Search, Settings, ShieldAlert, SlidersHorizontal, X
} from 'lucide-react';
import clsx from 'clsx';
import { db } from '../db';
import { excerpt } from '../lib/text';

const nav = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/library', 'Lore Library', Library],
  ['/timeline', 'Timeline', Clock3],
  ['/relationships', 'Relationship Map', GitBranch],
  ['/city', 'City Structure', Map],
  ['/rules', 'Rules Engine', SlidersHorizontal],
  ['/questions', 'Questions', CircleHelp],
  ['/contradictions', 'Contradictions', ShieldAlert],
  ['/writing', 'Writing Room', FilePenLine],
  ['/assistant', 'AI Context', BrainCircuit],
  ['/settings', 'Settings & Backup', DatabaseBackup]
] as const;

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const entries = useLiveQuery(() => db.entries.orderBy('updatedAt').reverse().toArray(), []) ?? [];
  const project = useLiveQuery(() => db.projects.toCollection().first(), []);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setPaletteOpen((value) => !value);
      }
      if (event.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.slice(0, 8);
    return entries.filter((entry) => `${entry.title} ${entry.summary} ${entry.aliases.join(' ')} ${entry.tags.join(' ')} ${entry.body}`.toLowerCase().includes(q)).slice(0, 12);
  }, [entries, query]);

  const side = (
    <aside className={clsx('flex h-full flex-col border-r border-white/10 bg-[#07110f]/95 transition-all', collapsed ? 'w-[78px]' : 'w-[248px]')}>
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 shadow-phosphor"><Cable size={21} className="text-emerald-200" /></div>
        {!collapsed && <div className="min-w-0"><div className="font-semibold text-white">Schism Codex</div><div className="truncate font-mono text-[10px] uppercase tracking-widest text-emerald-300/55">Local node // secure</div></div>}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => clsx('group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition', isActive ? 'bg-emerald-300/12 text-emerald-100 ring-1 ring-inset ring-emerald-300/15' : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100')} title={collapsed ? label : undefined}><Icon size={18} className="shrink-0" />{!collapsed && <span>{label}</span>}</NavLink>)}
      </nav>
      <div className="border-t border-white/10 p-3">
        {!collapsed && <div className="mb-3 rounded-xl bg-white/[0.035] p-3"><div className="eyebrow">Current project</div><div className="mt-1 truncate text-sm font-medium text-slate-200">{project?.name ?? 'Loading…'}</div><div className="mt-1 text-xs text-slate-500">{entries.length} lore entries</div></div>}
        <button onClick={() => setCollapsed((value) => !value)} className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-white/5 hover:text-white"><ChevronsLeft size={17} className={clsx('transition', collapsed && 'rotate-180')} />{!collapsed && 'Collapse'}</button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-transparent text-slate-100">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{side}</div>
      {mobileOpen && <><div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setMobileOpen(false)} /><div className="fixed inset-y-0 left-0 z-50 lg:hidden">{side}</div></>}
      <div className={clsx('min-w-0 flex-1 transition-all', collapsed ? 'lg:pl-[78px]' : 'lg:pl-[248px]')}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-[#07110f]/85 px-4 backdrop-blur-xl md:px-6">
          <button className="button-secondary !p-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={19} /></button>
          <button onClick={() => setPaletteOpen(true)} className="flex min-w-0 max-w-xl flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-left text-sm text-slate-500 hover:border-white/20"><Search size={17} /><span className="truncate">Search all lore, aliases, tags and notes…</span><span className="ml-auto hidden rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[10px] sm:inline">Ctrl K</span></button>
          <div className="ml-auto flex items-center gap-2"><span className="hidden items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-200 sm:flex"><Activity size={12} /> IndexedDB online</span><NavLink to="/settings" className="button-secondary !p-2" aria-label="Settings"><Settings size={18} /></NavLink></div>
        </header>
        <main className="mx-auto max-w-[1540px] p-4 md:p-6 xl:p-8"><Outlet /></main>
      </div>

      {paletteOpen && <div className="fixed inset-0 z-[90] flex items-start justify-center bg-black/70 p-4 pt-[10vh]" onMouseDown={(event) => { if (event.target === event.currentTarget) setPaletteOpen(false); }}>
        <div className="panel w-full max-w-2xl overflow-hidden shadow-2xl">
          <div className="flex items-center gap-3 border-b border-white/10 px-4"><Search size={19} className="text-emerald-300" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the Codex…" className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-slate-600" /><button onClick={() => setPaletteOpen(false)} className="text-slate-500 hover:text-white"><X size={19} /></button></div>
          <div className="max-h-[55vh] overflow-y-auto p-2">
            {results.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">No matching records.</div> : results.map((entry) => <button key={entry.id} onClick={() => { navigate(`/entry/${entry.id}`); setPaletteOpen(false); setQuery(''); }} className="flex w-full gap-3 rounded-xl p-3 text-left hover:bg-white/[0.05]"><BookOpen size={17} className="mt-0.5 shrink-0 text-emerald-300/70" /><div className="min-w-0"><div className="font-medium text-slate-100">{entry.title}</div><div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{excerpt(entry.summary || entry.body, 130)}</div></div></button>)}
          </div>
        </div>
      </div>}
    </div>
  );
}
