import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { CalendarClock, Plus, X } from 'lucide-react';
import { db } from '../db';
import { makeId } from '../lib/id';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import type { CanonStatus, TimelineEvent } from '../types';

export function TimelinePage() {
  const events = useLiveQuery(() => db.timeline.orderBy('order').toArray(), []) ?? [];
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', dateLabel: '', description: '', approximate: true, canonStatus: 'draft' as CanonStatus });
  async function addEvent() {
    if (!form.title.trim() || !form.dateLabel.trim()) return;
    const now = new Date().toISOString();
    const record: TimelineEvent = { id: makeId('event'), projectId: 'project_analog_schism', title: form.title.trim(), dateLabel: form.dateLabel.trim(), description: form.description.trim(), order: events.length + 1, approximate: form.approximate, canonStatus: form.canonStatus, relatedEntryIds: [], createdAt: now, updatedAt: now };
    await db.timeline.add(record); setForm({ title: '', dateLabel: '', description: '', approximate: true, canonStatus: 'draft' }); setOpen(false);
  }
  return <>
    <PageHeader eyebrow="Chronology and competing accounts" title="Timeline" description="Track exact, approximate and relative dates without flattening disputed history into one account." actions={<button className="button-primary" onClick={() => setOpen(true)}><Plus size={17} /> Add event</button>} />
    <section className="panel overflow-hidden p-5 md:p-7">
      <div className="relative ml-3 border-l border-emerald-300/20 pl-7 md:ml-5 md:pl-10">
        {events.map((event, index) => <article key={event.id} className="relative pb-9 last:pb-0"><div className="absolute -left-[35px] top-0 grid size-4 place-items-center rounded-full border border-emerald-300/40 bg-[#07110f] md:-left-[47px]"><div className="size-1.5 rounded-full bg-emerald-300" /></div><div className="grid gap-3 lg:grid-cols-[210px_1fr]"><div><div className="font-mono text-xs uppercase tracking-wider text-emerald-300/70">{event.dateLabel}</div>{event.approximate && <div className="mt-1 text-[10px] text-slate-600">Approximate</div>}</div><div className="panel-muted p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="eyebrow">Event {String(index + 1).padStart(2, '0')}</div><h2 className="mt-1 text-lg font-semibold text-white">{event.title}</h2></div><StatusBadge status={event.canonStatus} /></div><p className="mt-3 text-sm leading-6 text-slate-400">{event.description}</p>{event.entryId && <Link to={`/entry/${event.entryId}`} className="mt-3 inline-flex text-sm text-emerald-200">Open linked lore</Link>}</div></div></article>)}
      </div>
    </section>
    {open && <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4"><div className="panel w-full max-w-xl p-5"><div className="flex items-center justify-between"><div><p className="eyebrow">New chronology record</p><h2 className="mt-1 text-xl font-semibold text-white">Add timeline event</h2></div><button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white"><X /></button></div><div className="mt-5 space-y-4"><label className="block"><span className="text-xs text-slate-400">Event title</span><input className="input mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label><label className="block"><span className="text-xs text-slate-400">Fictional date label</span><input className="input mt-1" value={form.dateLabel} onChange={(e) => setForm({ ...form, dateLabel: e.target.value })} placeholder="e.g. 3 years before present" /></label><label className="block"><span className="text-xs text-slate-400">Description</span><textarea className="input mt-1 min-h-28" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><div className="grid gap-4 sm:grid-cols-2"><select className="input" value={form.canonStatus} onChange={(e) => setForm({ ...form, canonStatus: e.target.value as CanonStatus })}>{['canon','provisional','draft','disputed','rumour','secret'].map((s) => <option key={s} value={s}>{s}</option>)}</select><label className="flex items-center gap-2 rounded-xl border border-white/10 px-3 text-sm text-slate-400"><input type="checkbox" checked={form.approximate} onChange={(e) => setForm({ ...form, approximate: e.target.checked })} className="accent-emerald-300" /> Approximate date</label></div></div><div className="mt-6 flex justify-end gap-2"><button className="button-secondary" onClick={() => setOpen(false)}>Cancel</button><button className="button-primary" onClick={() => void addEvent()}><CalendarClock size={16} /> Add event</button></div></div></div>}
  </>;
}
