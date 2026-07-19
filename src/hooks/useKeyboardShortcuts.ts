import { useEffect } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;

interface Shortcut {
  key: string;
  handler: ShortcutHandler;
  description: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        if (
          ctrlMatch &&
          shiftMatch &&
          altMatch &&
          e.key.toLowerCase() === shortcut.key.toLowerCase()
        ) {
          e.preventDefault();
          shortcut.handler(e);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}
