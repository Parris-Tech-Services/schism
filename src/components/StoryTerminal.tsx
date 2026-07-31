import { useState, useRef, useEffect } from 'react';
import type { Scene, Choice, GameState, StoryMap, StoryLocation, StoryExit } from '../types/story';
import { isChoiceEnabled } from '../services/storyEngine';
import clsx from 'clsx';
import { Send, Settings, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  scene?: Scene;
  gameState: GameState;
  onChoice: (choice: Choice) => void;
  onCommand: (command: string) => void;
  commandLog: { text: string; isPlayer: boolean; type?: 'error' | 'success' | 'normal' }[];
  onSave: () => void;
  onLoad: () => void;
  onRestart: () => void;
  currentLocation?: StoryLocation;
  currentMap?: StoryMap;
  exits: StoryExit[];
}

export function StoryTerminal({ scene, gameState, onChoice, onCommand, commandLog, onSave, onLoad, onRestart, currentLocation, currentMap, exits }: Props) {
  const [cmd, setCmd] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [showSettings, setShowSettings] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');
  const [crtEffect, setCrtEffect] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'objectives' | 'inventory' | 'journal' | 'help'>('map');

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandLog, scene, currentLocation]);

  function handleCommandSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cmd.trim()) return;
    setHistory(prev => [cmd.trim(), ...prev]);
    setHistoryIdx(-1);
    onCommand(cmd.trim());
    setCmd('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setCmd(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setCmd(history[nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setCmd('');
      }
    }
  }

  // Global key listener for movement when not focused in input
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (document.activeElement === inputRef.current) return;
      if (['ArrowUp', 'w', 'W'].includes(e.key)) onCommand('north');
      else if (['ArrowDown', 's', 'S'].includes(e.key)) onCommand('south');
      else if (['ArrowLeft', 'a', 'A'].includes(e.key)) onCommand('west');
      else if (['ArrowRight', 'd', 'D'].includes(e.key)) onCommand('east');
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [onCommand]);

  const textColor = highContrast ? 'text-white' : 'text-[#8fd7bd]';
  const bgColor = highContrast ? 'bg-black' : 'bg-[#0a1210]';
  const borderColor = highContrast ? 'border-white' : 'border-[#1a302b]';

  function renderMap() {
    if (!currentMap || !currentLocation) return <div className="p-4 text-center opacity-50">No map available</div>;
    
    // Very simplified relative ASCII grid for local view
    // In a real grid, you'd calculate true X/Y bounds of discovered locations.
    const hasNorth = exits.some(e => e.direction === 'north');
    const hasSouth = exits.some(e => e.direction === 'south');
    const hasEast = exits.some(e => e.direction === 'east');
    const hasWest = exits.some(e => e.direction === 'west');

    return (
      <div className="flex flex-col items-center justify-center font-mono text-sm leading-none space-y-1">
        <div className="h-4">{hasNorth ? '?' : ' '}</div>
        <div className="h-4">{hasNorth ? '│' : ' '}</div>
        <div className="flex items-center">
          <span className="w-4 text-right">{hasWest ? '?' : ' '}</span>
          <span className="w-4 text-center">{hasWest ? '─' : ' '}</span>
          <span className="w-4 text-center font-bold text-white">@</span>
          <span className="w-4 text-center">{hasEast ? '─' : ' '}</span>
          <span className="w-4 text-left">{hasEast ? '?' : ' '}</span>
        </div>
        <div className="h-4">{hasSouth ? '│' : ' '}</div>
        <div className="h-4">{hasSouth ? '?' : ' '}</div>
        <div className="mt-4 text-xs opacity-50 text-center">
          Legend: @ You · Visited ? Discovered
        </div>
        <div className="sr-only">
          You are in {currentLocation.title}. Known exits: {exits.map(e => e.direction).join(', ') || 'None'}.
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(
      "flex h-full w-full flex-col font-mono",
      bgColor, textColor,
      textSize === 'large' ? 'text-lg' : 'text-base',
      crtEffect && "crt-overlay"
    )}>
      {/* Header */}
      <header className={clsx("flex items-center justify-between border-b p-4 shrink-0", borderColor)}>
        <h1 className="text-xl font-bold uppercase tracking-widest">{currentMap?.title || 'Unknown Region'}</h1>
        <div className="flex gap-4">
          <button onClick={() => setShowSettings(!showSettings)} className="hover:text-white" aria-label="Settings"><Settings size={18} /></button>
          <button onClick={onSave} className="hover:text-white">Save</button>
          <button onClick={onLoad} className="hover:text-white">Load</button>
        </div>
      </header>

      {/* Settings */}
      {showSettings && (
        <div className={clsx("border-b p-4 shrink-0", borderColor, highContrast ? 'bg-zinc-900' : 'bg-[#101c18]')}>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={crtEffect} onChange={(e) => setCrtEffect(e.target.checked)} /> Scan lines & CRT</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={textSize === 'large'} onChange={(e) => setTextSize(e.target.checked ? 'large' : 'normal')} /> Large Text</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} /> High Contrast</label>
            <button onClick={onRestart} className="ml-auto text-red-400 hover:text-red-300">Restart Chapter</button>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0 flex-col md:flex-row">
        
        {/* Left: Terminal */}
        <div className={clsx("flex-1 overflow-y-auto p-4 md:p-8 flex flex-col border-b md:border-b-0 md:border-r", borderColor)}>
          <div className="mx-auto max-w-2xl w-full space-y-6">
            
            {/* Description */}
            <section className="space-y-4 whitespace-pre-wrap leading-relaxed" aria-live="polite">
              <div className="font-bold uppercase tracking-wide opacity-50 border-b border-current pb-2 mb-4">
                {currentLocation?.title || 'Unknown Location'}
              </div>
              {scene?.narratorText || currentLocation?.description}
            </section>

            {/* Scene Choices */}
            {scene?.choices && scene.choices.length > 0 && (
              <section className="mt-6 space-y-3" aria-label="Available Actions">
                {scene.choices.map(choice => {
                  const enabled = isChoiceEnabled(choice, gameState);
                  return (
                    <button
                      key={choice.id}
                      onClick={() => enabled && onChoice(choice)}
                      disabled={!enabled}
                      className={clsx(
                        "block w-full text-left border p-3 transition-colors",
                        enabled ? (highContrast ? "border-white hover:bg-white hover:text-black" : "border-[#4a7568] hover:bg-[#4a7568]/20 hover:border-[#8fd7bd]") : "opacity-40 cursor-not-allowed border-transparent"
                      )}
                    >
                      <span className="font-bold opacity-50 mr-3">&gt;</span>{choice.label}
                      {!enabled && choice.disabledReason && <span className="ml-3 italic opacity-70">({choice.disabledReason})</span>}
                    </button>
                  );
                })}
              </section>
            )}

            {/* History Log */}
            {commandLog.length > 0 && (
              <section className="mt-8 space-y-2" aria-live="polite">
                <div className="border-t border-dashed border-current pt-4 mb-4 opacity-30" />
                {commandLog.map((log, i) => (
                  <div key={i} className={clsx("whitespace-pre-wrap", 
                    log.isPlayer ? "font-bold opacity-100" : "opacity-80",
                    log.type === 'error' && "text-red-400",
                    log.type === 'success' && "text-emerald-400"
                  )}>
                    {log.isPlayer ? `> ${log.text}` : log.text}
                  </div>
                ))}
              </section>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Right: Utility Panel */}
        <aside className={clsx("w-full md:w-80 flex flex-col shrink-0 bg-black/20")}>
          <div className={clsx("flex border-b overflow-x-auto", borderColor)}>
            {(['map', 'objectives', 'inventory', 'journal', 'help'] as const).map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={clsx("px-4 py-3 uppercase text-xs tracking-wider border-b-2 font-bold transition-colors whitespace-nowrap", activeTab === t ? "border-current opacity-100" : "border-transparent opacity-40 hover:opacity-100")}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {activeTab === 'map' && renderMap()}
            {activeTab === 'objectives' && (
              <div className="space-y-2">
                <div className="uppercase text-xs opacity-50 font-bold mb-2">Completed</div>
                {gameState.completedObjectives.length === 0 ? <div className="opacity-50">None</div> : gameState.completedObjectives.map(o => <div key={o}>- {o}</div>)}
              </div>
            )}
            {activeTab === 'inventory' && (
              <div className="space-y-2">
                {gameState.inventory.length === 0 ? <div className="opacity-50">Empty</div> : gameState.inventory.map(i => <div key={i}>- {i}</div>)}
              </div>
            )}
            {activeTab === 'journal' && (
              <div className="space-y-4">
                {gameState.journalEntries.length === 0 ? <div className="opacity-50">Empty</div> : gameState.journalEntries.map(j => (
                  <div key={j.id} className="text-sm">
                    <div className="opacity-50 text-xs mb-1">{new Date(j.timestamp).toLocaleTimeString()}</div>
                    <div>{j.text}</div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'help' && (
              <div className="text-sm space-y-4 opacity-80">
                <div><strong className="uppercase block text-xs opacity-70 mb-1">Movement</strong> north, south, east, west, up, down</div>
                <div><strong className="uppercase block text-xs opacity-70 mb-1">Observation</strong> look, examine [object]</div>
                <div><strong className="uppercase block text-xs opacity-70 mb-1">Interaction</strong> take [object], use [object] on [target], open [object]</div>
                <div><strong className="uppercase block text-xs opacity-70 mb-1">System</strong> map, save, load, restart, clear</div>
              </div>
            )}
          </div>
          
          {/* Direct Movement Controls */}
          <div className={clsx("p-4 border-t flex justify-center gap-2", borderColor)}>
            <div className="grid grid-cols-3 gap-2 w-max">
              <div />
              <button onClick={() => onCommand('north')} className="p-3 border border-current opacity-60 hover:opacity-100"><ArrowUp size={16}/></button>
              <div />
              <button onClick={() => onCommand('west')} className="p-3 border border-current opacity-60 hover:opacity-100"><ArrowLeft size={16}/></button>
              <button onClick={() => onCommand('south')} className="p-3 border border-current opacity-60 hover:opacity-100"><ArrowDown size={16}/></button>
              <button onClick={() => onCommand('east')} className="p-3 border border-current opacity-60 hover:opacity-100"><ArrowRight size={16}/></button>
            </div>
          </div>
        </aside>

      </div>

      {/* Footer Input */}
      <footer className={clsx("border-t p-4 shrink-0", borderColor)}>
        <form onSubmit={handleCommandSubmit} className="mx-auto flex max-w-4xl items-center gap-3">
          <span className="font-bold">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            onKeyDown={handleKeyDown}
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
