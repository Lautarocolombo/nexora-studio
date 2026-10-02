import { test, expect } from '@playwright/test';

/* ─────────────────────────────────────────────────────────────
   Contraste WCAG 2.1 (AA)

   Dos capas:
     1. Escaneo del texto realmente renderizado en 5 rutas × 2 temas.
        Resuelve el fondo efectivo componiendo de abajo hacia arriba
        background-color y gradientes CSS, y descuenta la opacidad
        heredada del texto. Solo se declara indeterminado lo que de
        verdad no se puede calcular (fotos de fondo), y aun así exige
        una cobertura mínima para que el test no pueda pasar sin
        comprobar nada.
     2. Test de los tokens del CSS, para que cambiar un color no
        pueda reintroducir el fallo en silencio.

   Nota sobre gradientes: la luminancia de un color interpolado
   linealmente queda entre las de sus extremos, así que comprobar
   todos los extremos cubre todo el degradado.
   ───────────────────────────────────────────────────────────── */

const THEMES = ['dark', 'light'] as const;
const ROUTES = ['/', '/servicios', '/portfolio', '/contacto', '/privacidad'];

type Finding = {
  ratio: number;
  need: number;
  text: string;
  cls: string;
  size: number;
  weight: number;
  theme: string;
  route: string;
};

test('todo el texto renderizado pasa WCAG AA en ambos temas', async ({ page }) => {
  const findings: Finding[] = [];
  let scanned = 0;
  let skipped = 0;
  let covered = 0;

  for (const route of ROUTES) {
    for (const theme of THEMES) {
      await page.goto(route);
      // Sin esto se mide el color a mitad de la transición de tema y salen
      // valores inventados (p. ej. el toggle de idioma marcaba 2.00:1).
      await page.addStyleTag({
        content: '*, *::before, *::after { transition: none !important; animation: none !important; }',
      });
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      await page.waitForTimeout(100);

      const result = await page.evaluate(
        ({ theme, route }) => {
          type Rgb = { r: number; g: number; b: number };
          type Layer = Rgb & { a: number };

          const parseColor = (v: string): Layer | null => {
            const m = v.match(/^rgba?\(([^)]+)\)$/);
            if (!m) return null;
            const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
            return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
          };
          const solid = (c: Layer): Rgb => ({ r: c.r, g: c.g, b: c.b });
          const over = (fg: Layer, bg: Rgb): Rgb => ({
            r: fg.r * fg.a + bg.r * (1 - fg.a),
            g: fg.g * fg.a + bg.g * (1 - fg.a),
            b: fg.b * fg.a + bg.b * (1 - fg.a),
          });
          const lum = ({ r, g, b }: Rgb) => {
            const f = (v: number) => {
              const c = v / 255;
              return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
            };
            return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
          };
          const ratio = (a: Rgb, b: Rgb) => {
            const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
            return (l1 + 0.05) / (l2 + 0.05);
          };

          // El navegador propaga el fondo desde html/body al canvas.
          const canvasBase = (): Rgb[] | null => {
            for (const n of [document.documentElement, document.body]) {
              const c = parseColor(getComputedStyle(n).backgroundColor);
              if (c && c.a >= 1) return [solid(c)];
            }
            return null;
          };

          /** Fondos posibles (acotados) bajo `el`, o null si hay una foto. */
          const backgroundsUnder = (el: Element): Rgb[] | null => {
            const inherited = el.parentElement ? backgroundsUnder(el.parentElement) : canvasBase();
            if (!inherited) return null;

            let list = inherited;
            const cs = getComputedStyle(el);

            const bc = parseColor(cs.backgroundColor);
            if (bc && bc.a > 0) {
              list = list.map((c) => (bc.a >= 1 ? solid(bc) : over(bc, c)));
            }

            const bi = cs.backgroundImage;
            if (bi && bi !== 'none') {
              // Una foto detrás depende del píxel exacto: indeterminado.
              if (bi.includes('url(')) return null;
              const stops = [...bi.matchAll(/rgba?\([^)]+\)/g)]
                .map((m) => parseColor(m[0]))
                .filter((s): s is Layer => s !== null);
              if (!stops.length) return null;
              // Cualquier punto del degradado se parece a uno de sus extremos.
              const next: Rgb[] = [];
              for (const s of stops) for (const c of list) next.push(s.a >= 1 ? solid(s) : over(s, c));
              // Acotar: basta con las luminancias extremas.
              const sorted = next.sort((a, b) => lum(a) - lum(b));
              list = [sorted[0]!, sorted[sorted.length - 1]!];
            }
            return list;
          };

          const opacityOf = (el: Element) => {
            let o = 1;
            for (let n: Element | null = el; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
            return o;
          };

          // elementsFromPoint ignora pointer-events:none, así que las fotos
          // decorativas se detectan por intersección geométrica de rects.
          const mediaRects = Array.from(document.querySelectorAll('img, video, canvas, picture')).map((n) =>
            n.getBoundingClientRect(),
          );

          const out: Omit<Finding, 'theme' | 'route'>[] = [];
          let skipped = 0;
          let covered = 0;

          for (const el of Array.from(document.querySelectorAll('body *'))) {
            const hasOwnText = Array.from(el.childNodes).some(
              (n) => n.nodeType === 3 && n.textContent!.trim().length > 0,
            );
            if (!hasOwnText) continue;

            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden') continue;
            const rect = el.getBoundingClientRect();
            if (rect.width < 1 || rect.height < 1) continue;

            // Las <option> las pinta el navegador con la paleta del sistema, no con
            // el CSS del sitio, así que su fondo real no es el del <select>.
            if (el.tagName === 'OPTION' || el.tagName === 'OPTGROUP') { skipped++; continue; }

            const raw = parseColor(cs.color);
            if (!raw) { skipped++; continue; }

            // El texto hereda la opacidad de todos sus ancestros. Con 0 es
            // invisible (p. ej. la trampa anti-spam del formulario) y medirlo
            // daría siempre 1.00:1.
            const textAlpha = raw.a * opacityOf(el);
            if (textAlpha < 0.02) { skipped++; continue; }

            const clip = cs.webkitBackgroundClip || cs.backgroundClip;
            const isGradientText = clip === 'text' || clip === 'text-border-area';
            const bi = cs.backgroundImage;

            // Los emojis se pintan con su propia fuente de color: el `color`
            // del CSS no los afecta, así que medirlos da falsos positivos.
            const own = el.textContent ?? '';
            if (/[\u{1F000}-\u{1FAFF}]/u.test(own)) { skipped++; continue; }

            // En texto con degradado el relleno ES el fondo del elemento, así
            // que el color de fondo real es el del padre, no el propio.
            const host = isGradientText ? el.parentElement : el;
            if (!host) { skipped++; continue; }

            const bgs = backgroundsUnder(host);
            if (!bgs) { skipped++; continue; }

            const r = rect;
            const overMedia = mediaRects.some(
              (m) => m.left < r.right && m.right > r.left && m.top < r.bottom && m.bottom > r.top,
            );
            if (overMedia) { skipped++; continue; }

            covered++;

            const size = parseFloat(cs.fontSize);
            const weight = Number(cs.fontWeight) || 400;
            const large = size >= 24 || (size >= 18.66 && weight >= 700);

            // Para texto con degradado, los posibles colores del texto son
            // los extremos del degradado; en el resto, el `color` calculado.
            const textColors: Rgb[] = isGradientText
              ? [...bi.matchAll(/rgba?\(([^)]+)\)/g)]
                  .map((m) => {
                    const p = m[1]!.split(/[,\s/]+/).filter(Boolean).map(Number);
                    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 } as Layer;
                  })
                  .map(solid)
              : [{ r: raw.r, g: raw.g, b: raw.b }];

            if (!textColors.length) { skipped++; continue; }

            // Peor caso: cada color de texto contra cada fondo posible.
            const worst = Math.min(
              ...textColors.flatMap((tc) =>
                bgs.map((bg) => ratio(over({ ...tc, a: textAlpha * (isGradientText ? 1 : raw.a) }, bg), bg)),
              ),
            );

            out.push({
              ratio: worst,
              need: large ? 3 : 4.5,
              text: el.textContent!.trim().slice(0, 48),
              cls: el.className.toString().slice(0, 70),
              size,
              weight,
            });
          }
          return { out, skipped, covered };
        },
        { theme, route },
      );

      scanned += result.out.length;
      skipped += result.skipped;
      covered += result.covered;
      findings.push(...result.out.map((f) => ({ ...f, theme, route })));
    }
  }

  const failures = findings.filter((f) => f.ratio < f.need - 0.005);

  const report = failures
    .slice(0, 25)
    .map(
      (f) =>
        `${f.ratio.toFixed(2)}:1 (necesita ${f.need}) [${f.route} ${f.theme}] ` +
        `"${f.text}" ${f.size}px/${f.weight} .${f.cls.split(' ').slice(0, 4).join('.')}`,
    )
    .join('\n');

  expect(
    failures.length,
    `${failures.length} textos bajo AA de ${scanned} escaneados (${skipped} indeterminados):\n${report}`,
  ).toBe(0);

  // Si el escaneo se queda sin cobertura, el test pasaría sin comprobar nada.
  expect(scanned, 'el escaneo debe cubrir texto real').toBeGreaterThan(300);
  expect(covered, 'casi todo el texto debe ser medible').toBeGreaterThan(scanned * 0.9);
  console.log(
    `contraste: ${scanned} evaluados (${covered} medibles), ${skipped} indeterminados, ${failures.length} fallos`,
  );
});

test('los tokens de texto y marca pasan AA por tema', async ({ page }) => {
  await page.goto('/');
  const names = ['--nx-bg', '--nx-text', '--nx-text-2', '--nx-text-muted', '--nx-brand-text'];

  const read = async (theme: string) => {
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    return page.evaluate(
      (ns) => {
        const cs = getComputedStyle(document.documentElement);
        return Object.fromEntries(ns.map((n) => [n, cs.getPropertyValue(n).trim()]));
      },
      names,
    );
  };

  const tokens = { dark: await read('dark'), light: await read('light') };

  const ratio = (a: string, b: string) => {
    const lum = (hex: string) => {
      const n = hex.replace('#', '');
      const [r, g, bl] = [0, 2, 4].map((i) => {
        const c = parseInt(n.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
    };
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };

  for (const theme of THEMES) {
    for (const name of names.slice(1)) {
      const value = tokens[theme][name];
      expect(value, `${name} sin definir en tema ${theme}`).toMatch(/^#[0-9a-f]{6}$/i);
      const r = ratio(value, tokens[theme]['--nx-bg']);
      expect(r, `${name} ${value} sobre ${tokens[theme]['--nx-bg']} da ${r.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
    }
  }
});