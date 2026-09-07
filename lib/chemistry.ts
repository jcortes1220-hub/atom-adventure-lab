export type Counts = Record<string, number>;
export type Compound = {
  id: string;
  name: string;
  commonName: string;
  formula: string;
  counts: Counts;
  description: string;
  uses: string[];
  funFact: string;
  category: string;
  level: number;
  rarity: string;
  hazardous: boolean;
  cid?: number;
  source: string;
};
export function parseFormula(formula: string): Counts {
  if (!formula || !/^[A-Z a-z0-9()·.]+$/.test(formula) || formula.includes(' '))
    throw Error('Use a chemical formula, such as H2O or Ca(OH)2.');
  const total: Counts = {};
  for (const part of formula.split(/[·.]/)) {
    if (!part) throw Error('Empty formula part.');
    let p = 0;
    const number = () => {
      const start = p;
      while (/[0-9]/.test(part[p] || '!')) p++;
      const n = start === p ? 1 : Number(part.slice(start, p));
      if (!Number.isSafeInteger(n) || n < 1 || n > 10000)
        throw Error('Atom counts must be positive whole numbers.');
      return n;
    };
    const multiplier = number();
    const group = (nested = false): Counts => {
      const out: Counts = {};
      while (p < part.length && part[p] !== ')') {
        let inner: Counts;
        if (part[p] === '(') {
          p++;
          inner = group(true);
          if (part[p] !== ')') throw Error('Close the parentheses.');
          p++;
        } else {
          const match = part.slice(p).match(/^[A-Z][a-z]?/);
          if (!match) throw Error('Invalid element symbol.');
          p += match[0].length;
          inner = { [match[0]]: 1 };
        }
        const n = number();
        for (const [s, v] of Object.entries(inner))
          out[s] = (out[s] || 0) + v * n;
      }
      if (!Object.keys(out).length) throw Error('Empty group.');
      if (!nested && p < part.length) throw Error('Unexpected parentheses.');
      return out;
    };
    const parsed = group();
    for (const [s, v] of Object.entries(parsed))
      total[s] = (total[s] || 0) + v * multiplier;
  }
  return total;
}
export const signature = (c: Counts) =>
  Object.keys(c)
    .filter((s) => c[s] > 0)
    .sort()
    .map((s) => s + ':' + c[s])
    .join('|');
export const atomTotal = (c: Counts) =>
  Object.values(c).reduce((a, b) => a + b, 0);
export function matchCompounds(
  counts: Counts,
  book: Compound[],
): { compound: Compound; units: number }[] {
  if (
    !Object.keys(counts).length ||
    Object.values(counts).some((n) => !Number.isSafeInteger(n) || n < 1)
  )
    return [];
  // Do not reduce molecular formulas to empirical ratios: H2O2 is not HO,
  // and C6H12O6 must not silently turn into six formaldehyde molecules.
  // Exact entries take precedence. Isomers remain separate candidates.
  const key = signature(counts),
    exact = book.filter((c) => signature(c.counts) === key);
  if (exact.length) return exact.map((compound) => ({ compound, units: 1 }));
  // With no exact entry, recognize only whole multiples of a complete entry.
  // All element types and every count must agree; never ignore leftover atoms.
  return book.flatMap((compound) => {
    const keys = Object.keys(compound.counts);
    if (keys.length !== Object.keys(counts).length) return [];
    const units = counts[keys[0]] / compound.counts[keys[0]];
    return Number.isInteger(units) &&
      units > 1 &&
      keys.every((s) => counts[s] === compound.counts[s] * units)
      ? [{ compound, units }]
      : [];
  });
}
export function validateCounts(value: unknown, symbols: Set<string>): Counts {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw Error('Choose some atom counts.');
  const counts: Counts = {};
  for (const [s, n] of Object.entries(value)) {
    if (
      !symbols.has(s) ||
      typeof n !== 'number' ||
      !Number.isInteger(n) ||
      n < 1 ||
      n > 999
    )
      throw Error('Use known elements and counts from 1 to 999.');
    counts[s] = n;
  }
  if (atomTotal(counts) > 2000)
    throw Error('This lab holds up to 2,000 atoms.');
  return counts;
}
