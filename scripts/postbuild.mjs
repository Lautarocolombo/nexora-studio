import { copyFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * Genera `dist/404.html` como copia de `index.html`.
 *
 * `vercel.json` solo reescribe las rutas conocidas, así que una URL
 * desconocida cae en el manejo 404 de Vercel: sirve este archivo con
 * status 404 real en vez de un 200 con la home (soft 404, que Google's
 * puede indexar como página duplicada).
 */
const dist = resolve(process.cwd(), 'dist');

try {
  await access(resolve(dist, 'index.html'));
} catch {
  console.error('postbuild: no se encontró dist/index.html — ¿corriste el build?');
  process.exit(1);
}

await copyFile(resolve(dist, 'index.html'), resolve(dist, '404.html'));
console.log('postbuild: dist/404.html generado');
