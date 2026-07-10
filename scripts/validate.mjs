import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_PREFIXES = ['http://', 'https://', '//', '#', 'mailto:', 'tel:', 'data:', 'javascript:', 'wa.me'];

const isLocal = (ref) => {
  if (!ref || ref.trim() === '') return false;
  return !SKIP_PREFIXES.some((p) => ref.startsWith(p)) && !ref.startsWith('/');
};

const htmlFiles = readdirSync(ROOT).filter((f) => f.endsWith('.html'));
let errors = 0;
const fail = (file, msg) => { errors++; console.error(`✗ ${file}: ${msg}`); };

for (const file of htmlFiles) {
  const html = readFileSync(join(ROOT, file), 'utf8');

  // 1. Duplicate ids
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) fail(file, `ids duplicados: ${[...new Set(dupes)].join(', ')}`);

  // 2. Local asset / link integrity
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (!isLocal(ref)) continue;
    const target = resolve(ROOT, ref);
    if (!existsSync(target) || !statSync(target).isFile()) {
      fail(file, `referencia rota: ${ref}`);
    }
  }

  // 3. Images without alt
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)];
  for (const im of imgs) {
    if (!/\balt=/.test(im[0])) fail(file, `imagen sin atributo alt: ${im[0].slice(0, 60)}`);
  }

  if (!errors) console.log(`✓ ${file}`);
}

if (errors) {
  console.error(`\nValidación fallida: ${errors} problema(s).`);
  process.exit(1);
}
console.log('\nValidación OK: integridad de enlaces, ids y accesibilidad básica.');
