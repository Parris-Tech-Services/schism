import { useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { FilePlus2, Link2, Trash2 } from 'lucide-react';
import { db } from '../db';
import { makeId } from '../lib/id';
import { PageHeader } from '../components/PageHeader';
import { RichTextEditor } from '../components/RichTextEditor';
import type { WritingNote } from '../types';

export function WritingPage(){
  const data=useLiveQuery(async()=>({notes:await db.writingNotes.orderBy('updatedAt').reverse().toArray(),entries:await db.entries.toArray()}),[]);
  const [selectedId,setSelectedId]=useState<string | null>(null); const [draft,setDraft]=useState<WritingNote|null>(null); const timer=useRef<number|undefined>();
  useEffect(()=>{const note=data?.notes.find(n=>n.id===(selectedId??data.notes[0]?.id));if(note){setSelectedId(note.id);setDraft(structuredClone(note));}},[data?.notes,selectedId]);
  function update<K extends keyof WritingNote>(key:K,value:WritingNote[K]){if(!draft)return;const next={...draft,[key]:value,updatedAt:new Date().toISOString()};setDraft(next);clearTimeout(timer.current);timer.current=window.setTimeout(()=>void db.writingNotes.put(next),700)}
  async function create(){const now=new Date().toISOString();const note:WritingNote={id:makeId('write'),projectId:'project_analog_schism',title:'Untitled scene',kind:'scene',body:'',relatedEntryIds:[],createdAt:now,updatedAt:now};await db.writingNotes.add(note);setSelectedId(note.id)}
  async function remove(){if(!draft||!confirm(`Delete “${draft.title}”?`))return;await db.writingNotes.delete(draft.id);setSelectedId(null);setDraft(null)}
  return <>
    <PageHeader eyebrow="Draft prose stays separate from canon" title="Writing Room" description="Develop scenes, arcs and dialogue while linking only the lore records relevant to the draft." actions={<button className="button-primary" onClick={()=>void create()}><FilePlus2 size={17}/> New note</button>}/>
    <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="panel max-h-[760px] overflow-y-auto p-2">{data?.notes.map(note=><button key={note.id} onClick={()=>setSelectedId(note.id)} className={`w-full rounded-xl p-3 text-left transition ${selectedId===note.id?'bg-emerald-300/10 ring-1 ring-inset ring-emerald-300/15':'hover:bg-white/[.04]'}`}><div className="truncate text-sm font-medium text-slate-200">{note.title}</div><div className="mt-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-slate-600"><span>{note.kind}</span><span>{new Date(note.updatedAt).toLocaleDateString()}</span></div></button>)}{data?.notes.length===0&&<div className="p-6 text-center text-sm text-slate-500">No writing notes yet.</div>}</aside>
      {draft?<section className="panel p-5 md:p-6"><div className="grid gap-3 md:grid-cols-[1fr_180px_auto]"><input className="input text-lg font-semibold" value={draft.title} onChange={e=>update('title',e.target.value)}/><select className="input" value={draft.kind} onChange={e=>update('kind',e.target.value as WritingNote['kind'])}>{['scene','outline','arc','chapter','dialogue','note'].map(k=><option key={k} value={k}>{k}</option>)}</select><button className="button-danger" onClick={()=>void remove()}><Trash2 size={16}/></button></div><div className="mt-5"><RichTextEditor value={draft.body} onChange={value=>update('body',value)} placeholder="Write the scene, outline or dialogue fragment…"/></div><div className="mt-5"><div className="flex items-center gap-2"><Link2 size={15} className="text-emerald-300"/><span className="eyebrow">Linked lore</span></div><select multiple className="input mt-2 min-h-40" value={draft.relatedEntryIds} onChange={e=>update('relatedEntryIds',Array.from(e.target.selectedOptions).map(option=>option.value))}>{data?.entries.sort((a,b)=>a.title.localeCompare(b.title)).map(entry=><option key={entry.id} value={entry.id}>{entry.title}</option>)}</select><p className="mt-2 text-xs text-slate-600">Hold Ctrl or Cmd to select multiple records. Writing notes never become canon automatically.</p></div></section>:<div className="panel grid min-h-[500px] place-items-center text-sm text-slate-500">Select or create a writing note.</div>}
    </div>
  </>
}
