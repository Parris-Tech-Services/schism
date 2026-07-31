import { useState, useRef, useEffect } from 'react';
import type { Scene, Choice } from '../types/story';
import { isChoiceEnabled } from '../services/storyEngine';
import type { GameState } from '../types/story';
import clsx from 'clsx';
import { Send, Settings, BookOpen, User, Archive } from 'lucide-react';

interface Props {
  scene: Scene;
  gameState: GameState;
  onChoice: (choice: Choice) => void;
  onCommand: (command: string) => void;
  commandLog: { text: string; isPlayer: boolean }[];
  onSave: () => void;
  onLoad: () => void;
  onRestart: () => void;
}

export function StoryTerminal({ scene, gameState, onChoice, onCommand, commandLog, onSave, onLoad, onRestart }: Props) {
  const [cmd, setCmd] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');
  const [crtEffect, setCrtEffect] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandLog, scene]);

  function handleCommandSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cmd.trim()) return;
    onCommand(cmd.trim());
    setCmd('');
  }

  const textColor = highContrast ? 'text-white' : 'text-[#8fd7bd]';
  const bgColor = highContrast ? 'bg-black' : 'bg-[#0a1210]';
  const borderColor = highContrast ? 'border-white' : 'border-[#1a302b]';

  return (
    <div className={clsx(
      "flex h-full w-full flex-col font-mono",
      bgColor, textColor,
      textSize === 'large' ? 'text-lg' : 'text-base',
      crtEffect && "crt-overlay"
    )}>
      {/* Header Bar */}
      <header className={clsx("flex items-center justify-between border-b p-4", borderColor)}>
        <h1 className="text-xl font-bold uppercase tracking-widest">{scene.title}</h1>
        <div className="flex gap-4">
          <button onClick={() => setShowSettings(!showSettings)} className="hover:text-white" aria-label="Settings"><Settings size={18} /></button>
          <button onClick={onSave} className="hover:text-white">Save</button>
          <button onClick={onLoad} className="hover:text-white">Load</button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className={clsx("border-b p-4", borderColor, highContrast ? 'bg-zinc-900' : 'bg-[#101c18]')}>
          <h2 className="mb-3 font-bold uppercase text-xs opacity-70">Accessibility & Settings</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={crtEffect} onChange={(e) => setCrtEffect(e.target.checked)} />
              Scan lines & CRT effect
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={textSize === 'large'} onChange={(e) => setTextSize(e.target.checked ? 'large' : 'normal')} />
              Large Text
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
              High Contrast
            </label>
            <button onClick={onRestart} className="ml-auto text-red-400 hover:text-red-300">Restart Chapter</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-3xl space-y-8">
          
          {/* Narrative Text */}
          <section className="space-y-4 whitespace-pre-wrap leading-relaxed" role="main" aria-live="polite">
            {scene.narratorText}
          </section>

          {/* Choices */}
          {scene.choices.length > 0 && (
            <section className="mt-8 space-y-3" aria-label="Available Actions">
              {scene.choices.map(choice => {
                const enabled = isChoiceEnabled(choice, gameState);
                return (
                  <button
                    key={choice.id}
                    onClick={() => enabled && onChoice(choice)}
                    disabled={!enabled}
                    className={clsx(
                      "block w-full text-left border p-3 transition-colors",
                      enabled 
                        ? highContrast 
                          ? "border-white hover:bg-white hover:text-black" 
                          : "border-[#4a7568] hover:bg-[#4a7568]/20 hover:border-[#8fd7bd]"
                        : "opacity-40 cursor-not-allowed border-transparent"
                    )}
                  >
                    <span className="font-bold opacity-50 mr-3">&gt;</span>
                    {choice.label}
                    {!enabled && choice.disabledReason && <span className="ml-3 italic opacity-70">({choice.disabledReason})</span>}
                  </button>
                );
              })}
            </section>
          )}

          {/* Command Log */}
          {commandLog.length > 0 && (
            <section className="mt-12 space-y-2 opacity-80" aria-live="polite">
              <div className="border-t border-dashed border-current pt-4 mb-4 opacity-30" />
              {commandLog.map((log, i) => (
                <div key={i} className={clsx("whitespace-pre-wrap", log.isPlayer ? "font-bold" : "opacity-90")}>
                  {log.isPlayer ? `> ${log.text}` : log.text}
                </div>
              ))}
            </section>
          )}
          
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Command Input */}
      <footer className={clsx("border-t p-4", borderColor)}>
        <form onSubmit={handleCommandSubmit} className="mx-auto flex max-w-3xl items-center gap-3">
          <span className="font-bold">&gt;</span>
          <input
            type="text"
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            placeholder="Enter command (e.g., look, inventory, help)..."
            className="flex-1 bg-transparent outline-none placeholder-current placeholder-opacity-40"
            autoComplete="off"
            spellCheck="false"
          />
          <button type="submit" className="opacity-70 hover:opacity-100"><Send size={18} /></button>
        </form>
      </footer>
    </div>
  );
}
