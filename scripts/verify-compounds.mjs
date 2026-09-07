import fs from 'node:fs';
const seeds = JSON.parse(fs.readFileSync('data/seeds.json', 'utf8'));
let prior = [];
try {
  prior = JSON.parse(fs.readFileSync('data/verification.json', 'utf8'));
} catch {}
const results = new Map(prior.map((x) => [x.id, x]));
let idx = 0;
async function worker() {
  while (idx < seeds.length) {
    const c = seeds[idx++];
    if (results.get(c.id)?.formula) continue;
    let result = { id: c.id, name: c.name };
    for (let retry = 0; retry < 3; retry++) {
      try {
        const res = await fetch(
          'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/' +
            encodeURIComponent(c.name) +
            '/property/MolecularFormula/JSON',
          { signal: AbortSignal.timeout(20000) },
        );
        if (!res.ok) throw Error('HTTP ' + res.status);
        const data = await res.json();
        result = {
          ...result,
          cid: data.PropertyTable.Properties[0].CID,
          formula: data.PropertyTable.Properties[0].MolecularFormula,
        };
        break;
      } catch (e) {
        result.error = String(e);
        await new Promise((r) => setTimeout(r, 800));
      }
    }
    results.set(c.id, result);
    fs.writeFileSync(
      'data/verification.json',
      JSON.stringify([...results.values()], null, 2),
    );
    if (results.size % 25 === 0)
      console.log('Verified lookup', results.size, '/', seeds.length);
    await new Promise((r) => setTimeout(r, 250));
  }
}
await Promise.all([worker(), worker()]);
console.log(
  'Finished',
  results.size,
  'records;',
  [...results.values()].filter((x) => !x.formula).length,
  'lookup failures',
);
