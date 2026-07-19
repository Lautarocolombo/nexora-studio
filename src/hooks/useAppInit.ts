import { useEffect } from 'react';
import { GarmentItem, SavedOutfit, WearLogEntry, Language } from '../types';
import { INITIAL_GARMENTS, INITIAL_OUTFITS, INITIAL_WEAR_LOGS } from '../data/initialWardrobe';
import { db } from '../lib/db';

interface UseAppInitOptions {
  setGarments: (items: GarmentItem[]) => void;
  setSavedOutfits: (items: SavedOutfit[]) => void;
  setWearLogs: (items: WearLogEntry[]) => void;
  setLanguage: (lang: Language) => void;
  setLoaded: (v: boolean) => void;
}

export function useAppInit({ setGarments, setSavedOutfits, setWearLogs, setLanguage, setLoaded }: UseAppInitOptions) {
  // Migrate old localStorage v1 -> v2
  useEffect(() => {
    ['outfitmatic_garments_v1', 'outfitmatic_outfits_v1', 'outfitmatic_logs_v1', 'outfitmatic_lang_v1'].forEach(key =>
      localStorage.removeItem(key)
    );
  }, []);

  // Load from IndexedDB on mount
  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const [savedGarments, savedOutfits, savedLogs, savedLang] = await Promise.all([
          db.getAll('garments'),
          db.getAll('outfits'),
          db.getAll('logs'),
          db.get('lang', 'language'),
        ]);

        if (cancelled) return;

        if (savedGarments.length > 0) {
          setGarments(savedGarments as GarmentItem[]);
        } else {
          await db.putAll('garments', INITIAL_GARMENTS);
          setGarments(INITIAL_GARMENTS);
        }

        if (savedOutfits.length > 0) {
          const normalized = (savedOutfits as unknown[]).map((o) => {
            const rec = o as Record<string, unknown>;
            if (Array.isArray(rec.items) && !Array.isArray(rec.garmentIds)) {
              return { ...rec, garmentIds: (rec.items as { id: string }[]).map((i) => i.id) };
            }
            return o;
          });
          setSavedOutfits(normalized as SavedOutfit[]);
        } else {
          await db.putAll('outfits', INITIAL_OUTFITS);
          setSavedOutfits(INITIAL_OUTFITS);
        }

        if (savedLogs.length > 0) {
          setWearLogs(savedLogs as WearLogEntry[]);
        } else {
          await db.putAll('logs', INITIAL_WEAR_LOGS);
          setWearLogs(INITIAL_WEAR_LOGS);
        }

        if (savedLang) {
          setLanguage((savedLang as { value: string }).value === 'en' ? 'en' : 'es');
        } else {
          await db.put('lang', { key: 'language', value: 'es' });
          setLanguage('es');
        }
      } catch (e) {
        console.error('Failed to load data from IndexedDB', e);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [setGarments, setSavedOutfits, setWearLogs, setLanguage, setLoaded]);
}
