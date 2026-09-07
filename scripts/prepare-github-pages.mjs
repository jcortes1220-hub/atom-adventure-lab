import fs from 'node:fs';
import path from 'node:path';

const output = path.resolve('dist/client');
const prefix = (process.env.ELEMENT_LAB_BASE_PATH || '').replace(/^\/+|\/+$/g, '');
if (!fs.existsSync(path.join(output, 'index.html'))) throw Error('Missing exported home page.');
if (prefix) {
  if (!/^[a-zA-Z0-9_.-]+$/.test(prefix) || prefix === '..') throw Error('Invalid repository path.');
  // Vinext emits prefixed assets inside the output. GitHub already mounts the
  // artifact at /repository, so assets must also exist at its artifact root.
  const assets = path.join(output, prefix, '_next');
  if (!fs.existsSync(assets)) throw Error('Expected prefixed assets were not built.');
  fs.cpSync(assets, path.join(output, '_next'), { recursive: true });
}
fs.writeFileSync(path.join(output, '.nojekyll'), '');
console.log('GitHub Pages artifact ready.');
