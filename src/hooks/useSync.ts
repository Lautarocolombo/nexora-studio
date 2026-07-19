import { useCallback, useEffect } from 'react';
import { db } from '../lib/db';
import { GarmentItem, SavedOutfit, WearLogEntry } from '../types';

export function useWardrobeSync(garments: GarmentItem[], setGarments: (items: GarmentItem[]) => void, loaded: boolean) {
  useEffect(() => {
    if (!loaded) return;
    try {
      db.putAll('garments', garments).catch(e => console.error('Failed to save garments', e));
    } catch (e) {
      console.error('Failed to save garments', e);
    }
  }, [garments, loaded]);
}

export function useOutfitsSync(savedOutfits: SavedOutfit[], setSavedOutfits: (items: SavedOutfit[]) => void, loaded: boolean) {
  useEffect(() => {
    if (!loaded) return;
    try {
      db.putAll('outfits', savedOutfits).catch(e => console.error('Failed to save outfits', e));
    } catch (e) {
      console.error('Failed to save outfits', e);
    }
  }, [savedOutfits, loaded]);
}

export function useWearLogsSync(wearLogs: WearLogEntry[], setWearLogs: (items: WearLogEntry[]) => void, loaded: boolean) {
  useEffect(() => {
    if (!loaded) return;
    try {
      db.putAll('logs', wearLogs).catch(e => console.error('Failed to save wearLogs', e));
    } catch (e) {
      console.error('Failed to save wearLogs', e);
    }
  }, [wearLogs, loaded]);
}

export function useLanguageSync(language: string, setLanguage: (lang: 'es' | 'en') => void, loaded: boolean) {
  useEffect(() => {
    if (!loaded) return;
    try {
      db.put('lang', { key: 'language', value: language }).catch(e => console.error('Failed to save lang', e));
    } catch (e) {
      console.error('Failed to save lang', e);
    }
  }, [language, loaded]);
}
