import { describe, expect, it } from 'vitest';
import { detectContradictions } from '../services/contradictions';
import type { ConstraintRule, LoreEntry } from '../types';

const base: LoreEntry = { id:'a',projectId:'p',moduleTypeId:'technology',title:'Relay',summary:'',body:'',customFields:{},canonStatus:'canon',confidence:100,tags:[],aliases:[],sourceIds:[],createdAt:'x',updatedAt:'x' };
const hardRule: ConstraintRule = { id:'r',projectId:'p',name:'No central Blight core',domain:'AI',rule:'Distributed only',rationale:'',severity:'hard',canonStatus:'canon',examples:[],exceptions:[],relatedEntryIds:[],createdAt:'x',updatedAt:'x' };

describe('contradiction detection', () => {
  it('finds missing summaries and orphan entries', () => {
    const result = detectContradictions([base], [], [hardRule]);
    expect(result.some((warning) => warning.type === 'missing-summary')).toBe(true);
    expect(result.some((warning) => warning.type === 'orphan')).toBe(true);
  });
  it('flags a kill-the-mainframe claim', () => {
    const result = detectContradictions([{ ...base, summary: 'They can kill the mainframe.' }], [], [hardRule]);
    expect(result.some((warning) => warning.type === 'rule-conflict')).toBe(true);
  });
});
