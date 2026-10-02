import { useEffect, useState } from 'react';

const STORAGE_KEY = 'nexora-theme';

export default function ThemeToggle({ t }) {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark',
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* sin persistencia disponible */
    }
  }, [theme]);

  const isDark = theme === 'dark';
  // Sin `t` el label quedaba siempre en español, incluso con la web en inglés.
  const label = isDark
    ? (t?.toLight ?? 'Activar modo claro')
    : (t?.toDark ?? 'Activar modo oscuro');

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={label}
      aria-pressed={!isDark}
      title={label}
      className="grid h-10 w-10 place-items-center rounded-md border border-line text-ink-2 transition hover:border-line-accent hover:text-ink"
    >
      <span aria-hidden="true">{isDark ? '☀' : '☾'}</span>
    </button>
  );
}
