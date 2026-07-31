import clsx from 'clsx';
import type { CanonStatus } from '../types';

const labels: Record<CanonStatus, string> = {
  canon: 'Canon', provisional: 'Provisional', draft: 'Draft', disputed: 'Disputed in-world', rumour: 'Rumour', secret: 'Secret truth', superseded: 'Superseded', rejected: 'Rejected'
};

const styles: Record<CanonStatus, string> = {
  canon: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200',
  provisional: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200',
  draft: 'border-slate-300/20 bg-slate-300/10 text-slate-300',
  disputed: 'border-amber-300/20 bg-amber-300/10 text-amber-200',
  rumour: 'border-violet-300/20 bg-violet-300/10 text-violet-200',
  secret: 'border-rose-300/20 bg-rose-300/10 text-rose-200',
  superseded: 'border-orange-300/20 bg-orange-300/10 text-orange-200',
  rejected: 'border-red-300/20 bg-red-300/10 text-red-200'
};

export function StatusBadge({ status, className }: { status: CanonStatus; className?: string }) {
  return <span className={clsx('inline-flex rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider', styles[status], className)}>{labels[status]}</span>;
}
