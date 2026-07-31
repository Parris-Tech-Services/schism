import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, CircleSlash2, ShieldAlert } from 'lucide-react';
import { db } from '../db';
import { PageHeader } from '../components/PageHeader';
import { detectContradictions } from '../services/contradictions';

export function ContradictionsPage(){
  const data=useLiveQuery(async()=>({entries:await db.entries.toArray(),relationships:await db.relationships.toArray(),rules:await db.rules.toArray()}),[]);
  const warnings=useMemo(()=>data?detectContradictions(data.entries,data.relationships,data.rules):[],[data]);
  const [ignored,setIgnored]=useState<string[]>(()=>JSON.parse(localStorage.getItem('schism-ignored-warnings')??'[]'));
  const visible=warnings.filter((warning)=>!ignored.includes(warning.id));
  function ignore(id:string){const next=[...ignored,id];setIgnored(next);localStorage.setItem('schism-ignored-warnings',JSON.stringify(next));}
  return <>
    <PageHeader eyebrow="Advisory integrity checks" title="Contradiction Centre" description="Warnings never rewrite or delete lore. They surface likely collisions so you can mark them intentional, supersede a version or edit the records yourself." />
    <section className="mb-4 grid gap-3 sm:grid-cols-3"><Metric label="High priority" value={visible.filter(w=>w.severity==='high').length} tone="red"/><Metric label="Needs review" value={visible.filter(w=>w.severity==='medium').length} tone="amber"/><Metric label="Hygiene signals" value={visible.filter(w=>w.severity==='low').length} tone="cyan"/></section>
    <section className="space-y-3">{visible.map((warning)=><article key={warning.id} className="panel p-5"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div className="flex gap-3"><div className={`grid size-10 shrink-0 place-items-center rounded-xl border ${warning.severity==='high'?'border-red-300/20 bg-red-300/10 text-red-200':warning.severity==='medium'?'border-amber-300/20 bg-amber-300/10 text-amber-200':'border-cyan-300/20 bg-cyan-300/10 text-cyan-200'}`}>{warning.severity==='high'?<ShieldAlert size={19}/>:<AlertTriangle size={19}/>}</div><div><div className="eyebrow">{warning.type.replaceAll('-',' ')} // {warning.severity}</div><h2 className="mt-1 font-semibold text-white">{warning.title}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{warning.description}</p><div className="mt-3 flex flex-wrap gap-2">{warning.entryIds.map((id)=><Link key={id} to={`/entry/${id}`} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-emerald-200 hover:bg-white/5">Open affected record</Link>)}</div></div></div><div className="flex shrink-0 gap-2"><button className="button-secondary !py-2" onClick={()=>ignore(warning.id)}><CircleSlash2 size={15}/> Mark intentional</button></div></div></article>)}</section>
    {visible.length===0&&<div className="panel p-12 text-center"><Check className="mx-auto text-emerald-300" size={30}/><h2 className="mt-4 text-lg font-semibold text-white">No active review signals</h2><p className="mt-2 text-sm text-slate-500">The current records do not trigger the implemented contradiction rules.</p></div>}
    {ignored.length>0&&<button className="button-secondary mt-4" onClick={()=>{setIgnored([]);localStorage.removeItem('schism-ignored-warnings')}}>Restore {ignored.length} ignored warnings</button>}
  </>
}
function Metric({label,value,tone}:{label:string;value:number;tone:'red'|'amber'|'cyan'}){const c=tone==='red'?'text-red-200':tone==='amber'?'text-amber-200':'text-cyan-200';return <div className="panel p-4"><div className={`text-2xl font-semibold ${c}`}>{value}</div><div className="mt-1 text-sm text-slate-500">{label}</div></div>}
