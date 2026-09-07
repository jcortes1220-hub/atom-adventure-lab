export const challenges = [
  ['water', 'Can you make water?', 'Two hydrogen atoms and one oxygen atom.'],
  [
    'carbon-dioxide',
    'Build carbon dioxide.',
    'One carbon atom and two oxygen atoms.',
  ],
  [
    'oxygen',
    'Make the gas our bodies use to breathe.',
    'Two oxygen atoms joined together.',
  ],
  [
    'sodium-chloride',
    'Can you make table salt?',
    'One sodium atom and one chlorine atom.',
  ],
  ['hydrogen', 'Make hydrogen gas.', 'Two hydrogen atoms.'],
  ['nitrogen', 'Build the main gas in air.', 'Two nitrogen atoms.'],
  ['methane', 'Build methane.', 'One carbon atom and four hydrogen atoms.'],
  [
    'ammonia',
    'Make a molecule with nitrogen and hydrogen.',
    'One nitrogen and three hydrogen atoms.',
  ],
  [
    'hydrogen-peroxide',
    'Find water’s formula cousin.',
    'Two hydrogen atoms and two oxygen atoms.',
  ],
  [
    'calcium-carbonate',
    'Discover the chemistry of seashells.',
    'One calcium, one carbon, and three oxygen atoms.',
  ],
  [
    'sodium-bicarbonate',
    'Build baking soda.',
    'One sodium, one hydrogen, one carbon, and three oxygen atoms.',
  ],
  [
    'silicon-dioxide',
    'Find the formula of quartz.',
    'One silicon and two oxygen atoms.',
  ],
  [
    'magnesium-oxide',
    'Build magnesium oxide.',
    'One magnesium and one oxygen atom.',
  ],
  [
    'iron-iii-oxide',
    'Find an iron mineral.',
    'Two iron atoms and three oxygen atoms.',
  ],
  ['ozone', 'Explore an oxygen trio.', 'Three oxygen atoms.'],
  [
    'glucose',
    'Find a sugar that powers living things.',
    'Use the Advanced Builder: C × 6, H × 12, O × 6. Then explore glucose.',
  ],
  [
    'sucrose',
    'Find table sugar.',
    'C × 12, H × 22, O × 11. Then explore sucrose.',
  ],
  [
    'ethanol',
    'Discover a molecule in disinfectants.',
    'C × 2, H × 6, O × 1. Then explore ethanol.',
  ],
  [
    'calcium-sulfate-dihydrate',
    'Build gypsum’s formula unit.',
    'Ca × 1, S × 1, O × 6, H × 4.',
  ],
  ['carbonic-acid', 'Find an acid in fizzy water.', 'H × 2, C × 1, O × 3.'],
  ['sodium-carbonate', 'Find washing soda.', 'Na × 2, C × 1, O × 3.'],
  [
    'potassium-chloride',
    'Find a salt that contains potassium.',
    'K × 1, Cl × 1.',
  ],
  ['citric-acid', 'Explore a sour citrus molecule.', 'C × 6, H × 8, O × 7.'],
  [
    'glycine',
    'Build a small protein building block.',
    'C × 2, H × 5, N × 1, O × 2.',
  ],
].map(([target, title, hint], i) => ({
  id: 'mission-' + (i + 1),
  target,
  title,
  hint,
  stars: 3,
}));
