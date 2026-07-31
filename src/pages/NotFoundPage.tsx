import { Link } from 'react-router-dom';
import { RadioTower } from 'lucide-react';
export function NotFoundPage(){return <div className="panel grid min-h-[65vh] place-items-center p-8 text-center"><div><RadioTower className="mx-auto text-emerald-300" size={42}/><p className="eyebrow mt-5">Signal lost</p><h1 className="mt-2 text-3xl font-semibold text-white">This node does not exist</h1><p className="mt-3 text-sm text-slate-500">The requested record may have been severed, renamed or deleted.</p><Link to="/" className="button-primary mt-6">Return to dashboard</Link></div></div>}
