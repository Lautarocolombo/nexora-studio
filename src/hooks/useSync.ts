import { useEffect, useRef } from 'react';
import { db } from '../lib/db';
import { GarmentItem, SavedOutfit, WearLogEntry } from '../types';

function useDebouncedEffect(effect: () => void, deps: unknown[], delay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => effect(), delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useWardrobeSync(garments: GarmentItem[], _setGarments: (items: GarmentItem[]) => void, loaded: boolean) {
  useDebouncedEffect(() => {
    if (!loaded) return;
    db.putAll('garments', garments).catch(e => console.error('Failed to save garments', e));
  }, [garments, loaded], 300);
}

export function useOutfitsSync(savedOutfits: SavedOutfit[], _setSavedOutfits: (items: SavedOutfit[]) => void, loaded: boolean) {
  useDebouncedEffect(() => {
    if (!loaded) return;
    db.putAll('outfits', savedOutfits).catch(e => console.error('Failed to save outfits', e));
  }, [savedOutfits, loaded], 300);
}

export function useWearLogsSync(wearLogs: WearLogEntry[], _setWearLogs: (items: WearLogEntry[]) => void, loaded: boolean) {
  useDebouncedEffect(() => {
    if (!loaded) return;
    db.putAll('logs', wearLogs).catch(e => console.error('Failed to save wearLogs', e));
  }, [wearLogs, loaded], 300);
}

export function useLanguageSync(language: string, _setLanguage: (lang: 'es' | 'en') => void, loaded: boolean) {
  useEffect(() => {
    if (!loaded) return;
    db.put('lang', { key: 'language', value: language }).catch(e => console.error('Failed to save lang', e));
  }, [language, loaded]);
}
