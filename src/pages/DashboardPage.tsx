import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, BookOpen, CircleHelp, Droplets, GitBranch, LockKeyhole, Network, Plus, ShieldAlert, Sparkles } from 'lucide-react';
import { db } from '../db';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { detectContradictions } from '../services/contradictions';
import { excerpt } from '../lib/text';

export function DashboardPage() {
  const data = useLiveQuery(async () => {
    const [project, entries, relationships, questions, rules, timeline] = await Promise.all([
      db.projects.toCollection().first(), db.entries.toArray(), db.relationships.toArray(), db.questions.toArray(), db.rules.toArray(), db.timeline.orderBy('order').toArray()
    ]);
    return { project, entries, relationships, questions, rules, timeline };
  }, []);
  if (!data?.project) return <div className="text-slate-500">Loading codex…</div>;
  const { project, entries, relationships, questions, rules, timeline } = data;
  const warnings = detectContradictions(entries, relationships, rules);
  const openQuestions = questions.filter((question) => question.status !== 'resolved');
  const recent = [...entries].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  const water = entries.find((entry) => entry.id === 'clean_water');
  const node = entries.find((entry) => entry.id === 'node_04');
  const factionCount = entries.filter((entry) => entry.moduleTypeId === 'faction' || entry.moduleTypeId === 'corporation').length;

  return <>
    <PageHeader eyebrow="World state // present day" title={project.name} description={project.description} actions={<><Link to="/entry/new" className="button-primary"><Plus size={17} /> New lore</Link><Link to="/assistant" className="button-secondary"><Sparkles size={17} /> Build AI context</Link></>} />

    <section className="grid gap-4 xl:grid-cols-[1.25fr_.85fr_.85fr]">
      <article className="panel scanlines relative overflow-hidden p-5 md:p-6">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative flex items-start justify-between gap-5"><div><p className="eyebrow">Current crisis</p><h2 className="mt-2 text-2xl font-semibold text-white">Clean-water capacity</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">{water?.summary}</p></div><div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10"><Droplets className="text-cyan-200" /></div></div>
        <div className="relative mt-6"><div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-wider text-slate-500"><span>System capacity</span><span className="text-red-300">Critical decline</span></div><div className="h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full w-[28%] rounded-full bg-gradient-to-r from-red-400 to-amber-300" /></div></div>
        <div className="relative mt-5 flex flex-wrap gap-2"><span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-400">Controlled by Ferrous</span><span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-400">Not replicable below</span><span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-400">Revolution bottleneck</span></div>
      </article>

      <article className="panel p-5"><div className="flex items-start justify-between"><div><p className="eyebrow">Active conflict web</p><div className="mt-2 text-3xl font-semibold text-white">{factionCount}</div><p className="mt-1 text-sm text-slate-500">factions and corporations</p></div><GitBranch className="text-amber-200" /></div><div className="mt-5 space-y-3"><Conflict label="Breakers ↔ Weavers" value="Open conflict" tone="red" /><Conflict label="Halcyon ↔ Vireo" value="Corporate cold war" tone="amber" /><Conflict label="Weaver currents" value="Fragmenting" tone="violet" /></div><Link to="/relationships" className="mt-5 inline-flex items-center gap-1.5 text-sm text-emerald-200 hover:text-emerald-100">Open relationship map <ArrowRight size={15} /></Link></article>

      <article className="panel scanlines p-5"><div className="flex items-start justify-between"><div><p className="eyebrow">Node 04 status</p><div className="mt-2 text-xl font-semibold text-white">Confirmed intact</div></div><LockKeyhole className="text-rose-200" /></div><p className="mt-4 text-sm leading-6 text-slate-400">{node?.summary}</p><div className="mt-5 grid grid-cols-3 gap-2 text-center"><Metric value="90 sec" label="incident log" /><Metric value="40k" label="neural scans" /><Metric value="1" label="logic map" /></div><Link to="/entry/node_04" className="mt-5 inline-flex items-center gap-1.5 text-sm text-emerald-200 hover:text-emerald-100">Open classified record <ArrowRight size={15} /></Link></article>
    </section>

    <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Stat icon={<BookOpen />} value={entries.length} label="Lore records" detail={`${entries.filter((e) => e.canonStatus === 'canon').length} confirmed canon`} />
      <Stat icon={<Network />} value={relationships.length} label="Relationships" detail="First-class directed links" />
      <Stat icon={<CircleHelp />} value={openQuestions.length} label="Open questions" detail="Awaiting canon decisions" />
      <Stat icon={<ShieldAlert />} value={warnings.length} label="Review signals" detail={`${warnings.filter((w) => w.severity === 'high').length} high priority`} />
    </section>

    <section className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
      <article className="panel p-5"><div className="mb-4 flex items-center justify-between"><div><p className="eyebrow">Recently touched</p><h2 className="mt-1 text-lg font-semibold text-white">Lore records</h2></div><Link to="/library" className="text-sm text-emerald-200">View all</Link></div><div className="divide-y divide-white/10">{recent.map((entry) => <Link key={entry.id} to={`/entry/${entry.id}`} className="flex gap-3 py-3 first:pt-0 last:pb-0 hover:text-white"><div className="mt-1 size-2 shrink-0 rounded-full bg-emerald-300/60" /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate text-sm font-medium text-slate-200">{entry.title}</h3><StatusBadge status={entry.canonStatus} /></div><p className="mt-1 line-clamp-1 text-xs text-slate-500">{excerpt(entry.summary || entry.body)}</p></div></Link>)}</div></article>
      <article className="panel p-5"><div className="mb-4 flex items-center justify-between"><div><p className="eyebrow">Narrative pressure</p><h2 className="mt-1 text-lg font-semibold text-white">Open questions</h2></div><Link to="/questions" className="text-sm text-emerald-200">Resolve</Link></div><div className="space-y-3">{openQuestions.slice(0, 4).map((question) => <div key={question.id} className="panel-muted p-3"><div className="flex items-start gap-2"><AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-200" /><div><div className="text-sm text-slate-200">{question.question}</div><div className="mt-1 text-xs leading-5 text-slate-500">{question.whyItMatters}</div></div></div></div>)}</div></article>
    </section>

    <section className="mt-4 panel p-5"><div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">Canon timeline</p><h2 className="mt-1 text-lg font-semibold text-white">Path to the present</h2></div><Link to="/timeline" className="text-sm text-emerald-200">Full timeline</Link></div><div className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">{timeline.map((event, index) => <div key={event.id} className="relative panel-muted p-3"><div className="mb-3 flex items-center gap-2"><span className="grid size-6 place-items-center rounded-full bg-emerald-300/10 font-mono text-[10px] text-emerald-200">{index + 1}</span><span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{event.dateLabel}</span></div><div className="text-sm font-medium text-slate-200">{event.title}</div></div>)}</div></section>
  </>;
}

function Conflict({ label, value, tone }: { label: string; value: string; tone: 'red' | 'amber' | 'violet' }) {
  const colour = tone === 'red' ? 'bg-red-300' : tone === 'amber' ? 'bg-amber-300' : 'bg-violet-300';
  return <div className="flex items-center justify-between gap-4 text-sm"><span className="text-slate-400">{label}</span><span className="flex items-center gap-2 text-xs text-slate-300"><span className={`size-1.5 rounded-full ${colour}`} />{value}</span></div>;
}
function Metric({ value, label }: { value: string; label: string }) { return <div className="rounded-xl bg-black/20 p-2"><div className="font-mono text-sm text-rose-200">{value}</div><div className="mt-1 text-[10px] uppercase tracking-wide text-slate-600">{label}</div></div>; }
function Stat({ icon, value, label, detail }: { icon: React.ReactNode; value: number; label: string; detail: string }) { return <article className="panel p-4"><div className="flex items-start justify-between"><div><div className="text-2xl font-semibold text-white">{value}</div><div className="mt-1 text-sm text-slate-300">{label}</div></div><div className="text-emerald-300/60">{icon}</div></div><div className="mt-3 text-xs text-slate-600">{detail}</div></article>; }
