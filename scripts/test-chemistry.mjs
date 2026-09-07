import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  parseFormula,
  matchCompounds,
  signature,
  validateCounts,
} from '../lib/chemistry.ts';
import { readProgress } from '../lib/progress.ts';
const book = JSON.parse(fs.readFileSync('data/compounds.json', 'utf8'));
const source = JSON.parse(fs.readFileSync('data/periodic-source.json', 'utf8'));
const ref = JSON.parse(
  fs.readFileSync('data/element-reference.json', 'utf8'),
).elements;
const symbols = new Set(source.Table.Row.map((r) => r.Cell[1]));
assert.equal(symbols.size, 118);
assert.ok(book.length >= 250);
assert.equal(new Set(book.map((c) => c.id)).size, book.length);
for (const c of book) {
  assert.equal(signature(parseFormula(c.formula)), signature(c.counts));
  validateCounts(c.counts, symbols);
  assert.ok(c.source.startsWith('https://'));
  assert.ok(c.description && c.funFact && c.uses.length);
  assert.ok(matchCompounds(c.counts, book).some((r) => r.compound.id === c.id));
}
for (const e of ref.filter((e) => e.number <= 118))
  assert.equal(
    e.shells.reduce((a, b) => a + b, 0),
    e.number,
  );
assert.deepEqual(parseFormula('CaSO4·2H2O'), { Ca: 1, S: 1, O: 6, H: 4 });
assert.deepEqual(parseFormula('Fe2(SO4)3'), { Fe: 2, S: 3, O: 12 });
assert.deepEqual(parseFormula('Ca5(PO4)3OH'), { Ca: 5, P: 3, O: 13, H: 1 });
assert.equal(matchCompounds({ H: 1, O: 1 }, book).length, 0);
assert.equal(matchCompounds({ H: 2, O: 1 }, book)[0].compound.id, 'water');
assert.equal(matchCompounds({ Na: 2, Cl: 2 }, book)[0].units, 2);
assert.equal(matchCompounds({ H: 4, O: 2 }, book)[0].compound.id, 'water');
assert.equal(
  matchCompounds({ H: 2, O: 2 }, book)[0].compound.id,
  'hydrogen-peroxide',
);
assert.equal(matchCompounds({ H: 2, O: 1, He: 1 }, book).length, 0);
assert.deepEqual(
  matchCompounds({ C: 6, H: 12, O: 6 }, book)
    .map((r) => r.compound.id)
    .sort(),
  ['fructose', 'galactose', 'glucose'],
);
assert.deepEqual(
  matchCompounds({ C: 2, H: 6, O: 1 }, book)
    .map((r) => r.compound.id)
    .sort(),
  ['dimethyl-ether', 'ethanol'],
);
for (const f of ['', 'H0', '(H2', 'H2)', 'Xx2', 'H2O+', 'H-2'])
  assert.throws(() => validateCounts(parseFormula(f), symbols));
assert.deepEqual(readProgress('{broken', new Set(), new Set()).found, []);
assert.deepEqual(
  readProgress(
    '{"found":["water","water","fake"],"completed":[]}',
    new Set(['water']),
    new Set(),
  ).found,
  ['water'],
);
console.log(
  'PASS: 311 discovery round-trips; exact counts; multiples; isomers; hydrates; invalid inputs; 118 electron totals; corrupt saved progress.',
);
