# Element Lab

A responsive React + TypeScript virtual chemistry playground. No API keys, backend, or runtime chemistry service is required.

## Run

Use Node 22.13+ and pnpm.

- `pnpm install`
- `pnpm dev`
- `pnpm test`
- `pnpm build`

The generated static site is in `dist/client`. Serve that directory with any static web server. The build wrapper preserves exit codes and lets native worker handles drain on Windows.

## Features

118 interactive elements, 311 verified discovery entries, 24 missions, local discovery/challenge progress, optional synthesized sound, atom counts and formula entry (including parentheses and hydrates), isomer choices, whole-number multiples, selected ball-and-stick diagrams, ionic electron-transfer animation, shell models, keyboard-accessible detail sheets, and reduced-motion support.

## Data and architecture

- `data/periodic-source.json`: downloaded PubChem element data.
- `data/element-reference.json`: supplementary electron shells and history; see `data/ELEMENT-DATA-LICENSE.md`.
- `data/elements.ts`: element mapping and kid-friendly notes.
- `data/seeds.json`: curated names, formulas, descriptions, IDs, levels.
- `data/verification.json`: formula lookup evidence and reference identifiers.
- `data/compounds.json`: complete runtime records; no network access in the game.
- `data/challenges.ts`: 24 missions.
- `lib/chemistry.ts`: parser, strict count validation, exact matching, and integer-multiple matching.
- `lib/progress.ts`: versioned local storage with validation and corrupt-data recovery.
- `components/lab`: element cards and scientific models.
- `app/page.tsx`: game modes and shared state.

To add a discovery, add a seed with a stable unique ID. Verify the name/formula against a scientific source (`scripts/verify-compounds.mjs` assists PubChem lookups), then run `scripts/finalize-data.mjs` and the tests. The finalizer rejects formulas that disagree with recorded evidence. Never derive a new substance solely from a generated combination of symbols. Add structures only when connectivity is independently known. Isomers have different stable IDs, even when formulas agree. Synonyms such as halite/table salt and quartz/silica share one entry.

## Chemistry boundaries

Exact formulas take precedence over ratios: H + O does not make water, H2O2 stays hydrogen peroxide, and C6H12O6 presents glucose/fructose/galactose candidates rather than six formaldehyde molecules. Without an exact entry, only complete integer multiples are matched, including 2 Na + 2 Cl as two NaCl formula units. Leftover atoms are never ignored.

The book is curated, not exhaustive; matching does not prove an actual chemical reaction or unique structure. Ionic/network solids use formula units rather than fictitious molecules. Hydrates count their included water. Mineral formulas are ideal compositions. Fe2O3 is hematite; real rust can include hydrated oxides and oxyhydroxides. White phosphorus and sulfur use P4 and S8 entries. Hazard notices are deliberately conservative, and the app provides no physical experiments.

Atomic physical values are condition-dependent. Missing or predicted data is marked rather than invented. Neutron counts refer to explicitly selected common isotopes where included, not rounded atomic weights. The illustrated electron paths are a counting model, not literal orbits.

## Validation

- All 311 formulas round-trip through the parser and matcher.
- Tests cover isomers, whole multiples, extra atoms, hydrates, parentheses, invalid input, all 118 shell totals, and corrupt/duplicate saved progress.
- Browser checks cover discovery and reload persistence, isomer choice, NaCl multiples and animation, challenge stars without repeat farming, drag/drop into the atom area, keyboard sheet dismissal, focus containment, and widths 390/768/1600.
- Separate enlarged-text and reduced-motion checks.
- Optional WebMCP stages validated counts in the same visible lab; valid/invalid contracts tested with a page registry shim. Actual native browser WebMCP support is feature-detected.

## Attribution

PubChem supplies primary element and compound evidence; NIST and the Handbook of Mineralogy support recorded exceptions. Bowserinator/Periodic-Table-JSON and Wikipedia contributors supply supplementary history/shell data under CC BY-SA 3.0. Adapted element-reference data remains under CC BY-SA 3.0. Lucide icons are used under the ISC license. See the in-app data credits and per-record source links.
