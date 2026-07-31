import { useState } from 'react';
import { parseCommand } from '../services/commandParser';
import { resolveVerb } from '../services/commandRegistry';

export function CommandTester() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);

  function testCommand() {
    if (!input.trim()) return;
    const parsed = parseCommand(input);
    const resolved = resolveVerb(parsed.verb);
    
    setResult({
      parsedVerb: parsed.verb,
      directObject: parsed.directObject || 'none',
      indirectObject: parsed.indirectObject || 'none',
      matchedCommand: resolved ? resolved.canonicalName : 'none',
      category: resolved ? resolved.category : 'unknown',
      mutatesState: resolved ? resolved.mutatesState : false,
      effectsRun: resolved ? (resolved.mutatesState ? 'Yes (if requirements pass)' : 'No') : 'No'
    });
  }

  return (
    <div className="p-4 border rounded bg-zinc-900 border-zinc-700 text-sm font-mono space-y-4">
      <h3 className="font-bold text-[#8fd7bd]">Parser Testing Panel</h3>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && testCommand()}
          placeholder="Enter test command..."
          className="flex-1 bg-black border border-zinc-700 px-3 py-2 text-white"
        />
        <button onClick={testCommand} className="px-4 py-2 bg-[#101c18] border border-[#4a7568] text-[#8fd7bd] hover:bg-[#4a7568] hover:text-white transition-colors">Test</button>
      </div>
      
      {result && (
        <div className="bg-black p-3 space-y-2 border border-zinc-800 text-zinc-300">
          <div><strong className="text-white">Parsed Verb:</strong> {result.parsedVerb}</div>
          <div><strong className="text-white">Direct Object:</strong> {result.directObject}</div>
          <div><strong className="text-white">Indirect Object:</strong> {result.indirectObject}</div>
          <div><strong className="text-white">Matched Command:</strong> {result.matchedCommand}</div>
          <div><strong className="text-white">Category:</strong> {result.category}</div>
          <div><strong className="text-white">Mutates State:</strong> {result.mutatesState ? 'true' : 'false'}</div>
          <div className="text-xs opacity-50 italic mt-2">Effects are never applied in parser-test mode.</div>
        </div>
      )}
    </div>
  );
}
