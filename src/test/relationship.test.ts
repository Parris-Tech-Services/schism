import { describe, expect, it } from 'vitest';
import { validateRelationship } from '../services/contradictions';

describe('relationship validation', () => {
  it('rejects self relationships', () => {
    expect(validateRelationship({ sourceId: 'same', targetId: 'same' })).toContain('cannot relate to itself');
  });
  it('accepts two distinct entries', () => {
    expect(validateRelationship({ sourceId: 'one', targetId: 'two' })).toBeNull();
  });
});
