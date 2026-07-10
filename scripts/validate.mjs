import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_PREFIXES = ['http://', 'https://', '//', '#', 'mailto:', 'tel:', 'data:', 'javascript:', 'wa.me'];

const isLocal = (ref) => {
  if (!ref || ref.trim() === '') return false;
  return !SKIP_PREFIXES.some((p) => ref.startsWith(p)) && !ref.startsWith('/');
};

const mins = [
  { src: 'src/css/style.css',   dist: 'css/style.min.css' },
  { src: 'src/js/script.js',    dist: 'js/script.min.js' },
  { src: 'src/js/projects.js',  dist: 'js/projects.min.js' }
];

let errors = 0;
const fail = (file, msg) => { errors++; console.error(`✗ ${file}: ${msg}`); };
const rel = (f) => f.replace(ROOT + '\\', '');

for (const m of mins) {
  const src = join(ROOT, m.src);
  const dist = join(ROOT, m.dist);
  if (!existsSync(src)) {
    fail(m.src, 'fuente no existe en src/');
    continue;
  }
  const srcStat = statSync(src);
  if (!existsSync(dist)) {
    fail(m.dist, 'minificado ausente, corré npm run build');
    continue;
  }
  const distStat = statSync(dist);
  if (distStat.mtimeMs < srcStat.mtimeMs) {
    console.warn(`! ${m.dist}: minificado desactualizado respecto a ${m.src}`);
  }
}

const htmlFiles = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
};
walk(ROOT);

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const label = rel(file);

  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) fail(label, `ids duplicados: ${[...new Set(dupes)].join(', ')}`);

  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (!isLocal(ref)) continue;
    const target = resolve(dirname(file), ref);
    if (!existsSync(target) || !statSync(target).isFile()) {
      fail(label, `referencia rota: ${ref}`);
    }
  }

  const imgs = [...html.matchAll(/<img\b[^>]*>/g)];
  for (const im of imgs) {
    if (!/\balt=/.test(im[0])) fail(label, `imagen sin atributo alt: ${im[0].slice(0, 60)}`);
  }

  if (!errors) console.log(`✓ ${label}`);
}

if (errors) {
  console.error(`\nValidación fallida: ${errors} problema(s).`);
  process.exit(1);
}
console.log('\nValidación OK: integridad de enlaces, ids, fuentes y artefactos minificados.');
