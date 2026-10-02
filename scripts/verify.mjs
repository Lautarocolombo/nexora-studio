import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const PORT = 4173;
const BASE = `http://localhost:${PORT}`;

/** Levanta `vite preview` y espera a que responda. */
async function startPreview() {
  const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    stdio: 'ignore',
  });

  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const res = await fetch(BASE, { signal: AbortSignal.timeout(1000) });
      if (res.ok) return proc;
    } catch {
      // Todavía no levanta.
    }
    await sleep(500);
  }

  proc.kill();
  throw new Error(`El servidor de preview no respondió en ${PORT}`);
}

/** Corre un script de verificación y propaga su código de salida. */
function run(script) {
  return new Promise((resolve) => {
    const child = spawn('node', [script], { stdio: 'inherit' });
    child.on('exit', (code) => resolve(code ?? 1));
  });
}

const preview = await startPreview();
let failed = 1;

try {
  const site = await run('scripts/verify-site.mjs');
  const portfolio = site === 0 ? await run('scripts/verify-portfolio.mjs') : 1;
  failed = site === 0 && portfolio === 0 ? 0 : 1;
} finally {
  preview.kill();
}

console.log(failed === 0 ? '\nVerificación completa: OK' : '\nVerificación: FALLÓ');
process.exit(failed);
