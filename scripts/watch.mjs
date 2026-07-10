import { watchFile } from 'node:fs';
import { exec } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const targets = [
  'src/css/style.css',
  'src/js/script.js',
  'src/js/projects.js'
];

const runBuild = () => {
  exec('npm run build', (error) => {
    if (error) {
      console.error(`[watch] build falló: ${error.message}`);
      return;
    }
    console.log('[watch] build actualizado');
  });
};

for (const rel of targets) {
  const full = join(ROOT, rel);
  watchFile(full, { interval: 500 }, runBuild);
}

console.log('[watch] vigilando src/ para build automático...');
