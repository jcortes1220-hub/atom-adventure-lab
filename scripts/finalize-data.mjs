import fs from 'node:fs';
import { parseFormula, signature, atomTotal } from '../lib/chemistry.ts';
const seeds = JSON.parse(fs.readFileSync('data/seeds.json', 'utf8'));
const checks = JSON.parse(fs.readFileSync('data/verification.json', 'utf8'));
const manual = {
  'iron-ii-iii-oxide': {
    formula: 'Fe3O4',
    source: 'https://www.ncbi.nlm.nih.gov/mesh/68052203',
  },
  'manganese-ii-chloride': { formula: 'MnCl2', cid: 24480 },
  'cobalt-ii-iii-oxide': { formula: 'Co3O4', cid: 6432046 },
  albite: {
    formula: 'NaAlSi3O8',
    source: 'https://www.handbookofmineralogy.org/pdfs/albite.pdf',
  },
  'sodium-sulfide': {
    formula: 'Na2S',
    source: 'https://janaf.nist.gov/tables/Na-032.html',
  },
};
const facts = {
  water: 'Ice floats on liquid water.',
  hydrogen: 'Hydrogen is the lightest gas.',
  oxygen: 'About one fifth of dry air is oxygen.',
  nitrogen: 'Its two atoms share a strong triple bond.',
  'sodium-chloride':
    'Its ions make repeating crystals. Halite is its mineral name.',
  'carbon-dioxide': 'The bubbles in fizzy drinks contain this gas.',
  'hydrogen-peroxide':
    'One extra oxygen per molecule makes it different from water.',
  'iron-iii-oxide':
    'Real rust is a mixture, often containing water and iron oxyhydroxides.',
  'silicon-dioxide':
    'Quartz has a giant network of bonded atoms, not separate SiO2 molecules.',
  'calcium-carbonate': 'Some caves have beautiful calcite crystals.',
  glucose: 'Plants make sugars using energy from sunlight.',
  fructose: 'It has the same atom counts as glucose but a different structure.',
  galactose: 'It shares its formula with glucose and fructose.',
  ethanol:
    'Dimethyl ether has the same atom counts with different connections.',
  'dimethyl-ether': 'It is an isomer of ethanol.',
  sucrose: 'It joins one glucose unit and one fructose unit.',
  lactose: 'It joins one glucose unit and one galactose unit.',
  maltose: 'It contains two joined glucose units.',
  'calcium-sulfate-dihydrate':
    'Two water molecules accompany each calcium sulfate formula unit.',
  'sulfur-hexafluoride': 'It is a powerful greenhouse gas.',
  'carbon-monoxide': 'It has no color or smell and is dangerous to breathe.',
  bromine: 'Bromine is one of two elements liquid at room temperature.',
  iodine: 'Solid iodine can give off purple vapor.',
  'phosphorus-pentoxide':
    'The name often uses an empirical formula, P2O5; this molecular form is P4O10.',
};
const common = {
  water: 'Water',
  hydrogen: 'Hydrogen gas',
  oxygen: 'Oxygen gas',
  nitrogen: 'Nitrogen gas',
  'sodium-chloride': 'Table salt · Halite',
  'sodium-bicarbonate': 'Baking soda',
  'calcium-carbonate': 'Calcite · Chalk',
  'silicon-dioxide': 'Silica · Quartz',
  'iron-iii-oxide': 'Hematite',
  'sodium-carbonate': 'Washing soda',
  glycerol: 'Glycerin',
  sucrose: 'Table sugar',
  lactose: 'Milk sugar',
  'magnesium-sulfate-heptahydrate': 'Epsom salt',
  'ascorbic-acid': 'Vitamin C',
  'potassium-hydrogen-tartrate': 'Cream of tartar',
  'sodium-tetraborate-decahydrate': 'Borax',
};
const safe = new Set([
  'water',
  'sodium-chloride',
  'sodium-bicarbonate',
  'calcium-carbonate',
  'glucose',
  'fructose',
  'galactose',
  'sucrose',
  'lactose',
  'maltose',
  'glycerol',
  'glycine',
  'alanine',
  'leucine',
  'isoleucine',
  'serine',
  'proline',
  'ribose',
  '2-deoxyribose',
  'mannitol',
  'sorbitol',
  'erythritol',
  'ascorbic-acid',
  'calcium-sulfate-dihydrate',
]);
const nonmetals = new Set([
  'H',
  'B',
  'C',
  'N',
  'O',
  'F',
  'Si',
  'P',
  'S',
  'Cl',
  'Se',
  'Br',
  'I',
]);
const compounds = seeds.map((c) => {
  const v = manual[c.id] || checks.find((x) => x.id === c.id);
  const counts = parseFormula(c.formula);
  if (!v?.formula || signature(counts) !== signature(parseFormula(v.formula)))
    throw Error('Unverified: ' + c.name);
  const keys = Object.keys(counts);
  let category =
    keys.length === 1
      ? 'Elemental molecule'
      : keys.some((k) => !nonmetals.has(k)) || /^NH4|^\(NH4/.test(c.formula)
        ? 'Ionic compound'
        : 'Molecular compound';
  if (
    ['SiO2', 'SiC', 'BN', 'WC'].includes(c.formula) ||
    c.id === 'albite' ||
    (counts.Si && keys.length > 2)
  )
    category = 'Network solid';
  if (['AlCl3', 'SnCl4'].includes(c.formula)) category = 'Molecular compound';
  let level = c.level;
  if (
    c.id === 'sulfur' ||
    c.id === 'white-phosphorus' ||
    c.formula.includes('·') ||
    [
      'dolomite',
      'potassium-feldspar',
      'albite',
      'anorthite',
      'forsterite',
      'fayalite',
      'zircon',
      'beryl',
      'kaolinite',
      'talc',
      'wollastonite',
    ].includes(c.id)
  )
    level = 4;
  if (
    counts.C &&
    counts.H &&
    c.level === 5 &&
    !keys.some((k) => !nonmetals.has(k))
  )
    level = 3;
  return {
    id: c.id,
    name: c.name,
    commonName: common[c.id] || c.commonName,
    formula: c.formula,
    counts,
    description: c.use,
    uses: [c.use],
    funFact:
      facts[c.id] ||
      (c.formula.includes('·')
        ? 'The dot marks water molecules included in the crystal.'
        : keys.length === 1
          ? 'A molecule can contain just one kind of element.'
          : keys.length +
            ' different elements appear in this formula, with ' +
            atomTotal(counts) +
            ' atoms in one ' +
            (category.includes('molecule') || category === 'Molecular compound'
              ? 'molecule'
              : 'formula unit') +
            '.'),
    category,
    level,
    rarity: ['Common', 'Uncommon', 'Rare', 'Rare', 'Advanced'][level - 1],
    hazardous: !safe.has(c.id),
    cid: v.cid,
    source: v.source || 'https://pubchem.ncbi.nlm.nih.gov/compound/' + v.cid,
  };
});
fs.writeFileSync('data/compounds.json', JSON.stringify(compounds, null, 2));
fs.writeFileSync(
  'data/verification.json',
  JSON.stringify(
    checks.map((c) =>
      manual[c.id] ? { id: c.id, name: c.name, ...manual[c.id] } : c,
    ),
    null,
    2,
  ),
);
console.log('Final verified discoveries:', compounds.length);
