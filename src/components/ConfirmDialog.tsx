import { AlertTriangle, X } from 'lucide-react';

export function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', destructive = false, onConfirm, onCancel }: {
  open: boolean; title: string; description: string; confirmLabel?: string; destructive?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="panel w-full max-w-md p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3"><AlertTriangle className={destructive ? 'text-red-300' : 'text-amber-300'} /><div><h2 id="dialog-title" className="font-semibold text-white">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></div></div>
          <button onClick={onCancel} className="text-slate-500 hover:text-white" aria-label="Close"><X size={19} /></button>
        </div>
        <div className="mt-6 flex justify-end gap-2"><button className="button-secondary" onClick={onCancel}>Cancel</button><button className={destructive ? 'button-danger' : 'button-primary'} onClick={onConfirm}>{confirmLabel}</button></div>
      </div>
    </div>
  );
}
