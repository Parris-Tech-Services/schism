export interface ParsedCommand {
  raw: string;
  verb: string;
  directObject?: string;
  indirectObject?: string;
}

const PREPOSITIONS = ['on', 'with', 'to', 'at', 'in', 'from', 'about', 'for'];
const ARTICLES = ['the', 'a', 'an', 'some'];

export function parseCommand(input: string): ParsedCommand {
  let cleanInput = input.toLowerCase().replace(/[.,!?;:]/g, ' ').trim();
  cleanInput = cleanInput.replace(/\s+/g, ' '); // collapse spaces

  if (!cleanInput) {
    return { raw: input, verb: '' };
  }

  // Handle quoted strings for direct/indirect objects if needed, but for now simple split
  const tokens = cleanInput.split(' ').filter(t => !ARTICLES.includes(t));

  if (tokens.length === 1) {
    return { raw: input, verb: tokens[0] };
  }

  // Handle "go north", "climb up"
  const movementVerbs = ['go', 'walk', 'move', 'run', 'climb'];
  if (movementVerbs.includes(tokens[0]) && tokens.length === 2) {
    return { raw: input, verb: tokens[1] }; // "go north" -> verb: "north"
  }
  
  if (tokens[0] === 'climb' && tokens.length === 1) return { raw: input, verb: 'up' };
  if (tokens[0] === 'descend' && tokens.length === 1) return { raw: input, verb: 'down' };

  // Two word verbs e.g. "pick up"
  let verb = tokens[0];
  let remainingTokens = tokens.slice(1);
  if (verb === 'pick' && remainingTokens[0] === 'up') {
    verb = 'take';
    remainingTokens = remainingTokens.slice(1);
  } else if (verb === 'look' && (remainingTokens[0] === 'at' || remainingTokens[0] === 'around')) {
    verb = remainingTokens[0] === 'at' ? 'examine' : 'look';
    remainingTokens = remainingTokens.slice(1);
  } else if (verb === 'talk' && remainingTokens[0] === 'to') {
    remainingTokens = remainingTokens.slice(1);
  }

  if (remainingTokens.length === 0) {
    return { raw: input, verb };
  }

  // Find preposition for indirect object
  let prepIndex = -1;
  for (let i = 0; i < remainingTokens.length; i++) {
    if (PREPOSITIONS.includes(remainingTokens[i])) {
      prepIndex = i;
      break;
    }
  }

  if (prepIndex === -1) {
    return { raw: input, verb, directObject: remainingTokens.join(' ') };
  }

  const directObject = remainingTokens.slice(0, prepIndex).join(' ');
  const indirectObject = remainingTokens.slice(prepIndex + 1).join(' ');

  return { 
    raw: input, 
    verb, 
    directObject: directObject || undefined, 
    indirectObject: indirectObject || undefined 
  };
}

export function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
    }
  }
  return matrix[a.length][b.length];
}

export function findBestMatch(target: string, candidates: string[], maxDistance = 2): string | null {
  let bestMatch = null;
  let bestDist = Infinity;
  for (const candidate of candidates) {
    if (candidate === target) return candidate; // Exact match
    if (candidate.startsWith(target)) return candidate; // Prefix match
    const dist = levenshtein(target, candidate);
    if (dist < bestDist && dist <= maxDistance) {
      bestDist = dist;
      bestMatch = candidate;
    }
  }
  return bestMatch;
}
