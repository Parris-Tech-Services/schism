import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { ArrowDown, Eye, Radio, Shield, WifiOff } from 'lucide-react';
import { db } from '../db';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';

export function CityPage() {
  const data = useLiveQuery(async () => ({ locations: (await db.entries.where('moduleTypeId').equals('location').toArray()).sort((a,b) => Number(a.customFields.order ?? 99) - Number(b.customFields.order ?? 99)), relationships: await db.relationships.toArray(), entries: await db.entries.toArray() }), []);
  const entryMap = new Map(data?.entries.map((entry) => [entry.id, entry]) ?? []);
  return <>
    <PageHeader eyebrow="Nested location system" title="City Structure" description="A vertical view generated from location records, not hard-coded page content. Add another location and give it an order field to extend the stack." />
    <section className="mx-auto max-w-5xl space-y-3">
      {data?.locations.map((location, index) => {
        const related = data.relationships.filter((rel) => rel.sourceId === location.id || rel.targetId === location.id).map((rel) => entryMap.get(rel.sourceId === location.id ? rel.targetId : rel.sourceId)).filter(Boolean).slice(0,4);
        const surveillance = String(location.customFields.surveillance ?? 'unknown'); const technology = String(location.customFields.technology ?? 'unknown');
        return <div key={location.id}>{index > 0 && <div className="flex justify-center py-1 text-emerald-300/40"><ArrowDown size={19} /></div>}<Link to={`/entry/${location.id}`} className="panel group grid gap-5 p-5 transition hover:border-emerald-300/20 md:grid-cols-[220px_1fr_auto]"><div><div className="eyebrow">Layer {String(index + 1).padStart(2,'0')}</div><h2 className="mt-2 text-xl font-semibold text-white">{location.title}</h2><div className="mt-3"><StatusBadge status={location.canonStatus} /></div></div><div><p className="text-sm leading-6 text-slate-400">{location.summary}</p><div className="mt-4 flex flex-wrap gap-2">{related.map((entry) => <span key={entry!.id} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-500">{entry!.title}</span>)}</div></div><div className="grid min-w-[190px] gap-2 self-start"><Datum icon={<Eye size={14} />} label="Surveillance" value={surveillance} /><Datum icon={technology.includes('hardwired') ? <WifiOff size={14} /> : <Radio size={14} />} label="Technology" value={technology} /><Datum icon={<Shield size={14} />} label="Access" value={index < 2 ? 'Restricted upward' : index < 4 ? 'Controlled' : 'Unverified'} /></div></Link></div>;
      })}
    </section>
  </>;
}
function Datum({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-xl border border-white/10 bg-black/15 p-2.5"><div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-600">{icon}{label}</div><div className="mt-1 text-xs capitalize text-slate-300">{value}</div></div>; }
