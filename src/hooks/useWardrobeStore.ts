import React, { useState, useCallback } from 'react';
import { GarmentItem, SavedOutfit, WearLogEntry, Language } from '../types';
import { INITIAL_GARMENTS, INITIAL_OUTFITS, INITIAL_WEAR_LOGS } from '../data/initialWardrobe';
import { db } from '../lib/db';
import { toast } from 'sonner';
import { trackEvent } from './useAnalytics';
import {
  useWardrobeSync,
  useOutfitsSync,
  useWearLogsSync,
  useLanguageSync,
} from './useSync';

export interface WardrobeStore {
  garments: GarmentItem[];
  savedOutfits: SavedOutfit[];
  wearLogs: WearLogEntry[];
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  setGarments: React.Dispatch<React.SetStateAction<GarmentItem[]>>;
  setSavedOutfits: React.Dispatch<React.SetStateAction<SavedOutfit[]>>;
  setWearLogs: React.Dispatch<React.SetStateAction<WearLogEntry[]>>;
  loaded: boolean;
  setLoaded: (v: boolean) => void;

  handleLogWear: (e: React.MouseEvent | undefined, garment: GarmentItem) => void;
  handleToggleFavorite: (e: React.MouseEvent | undefined, garmentId: string) => void;
  handleDeleteGarment: (garmentId: string) => void;
  handleUpdateNotes: (garmentId: string, newNotes: string) => void;
  handleAddGarment: (newGarmentData: Omit<GarmentItem, 'id'>) => void;
  handleUpdateGarment: (id: string, data: Partial<GarmentItem>) => void;
  handleSaveOutfit: (outfitData: Omit<SavedOutfit, 'id' | 'createdAt'>) => void;
  handleLogOutfitWear: (outfit: SavedOutfit) => void;
  handleDeleteOutfit: (outfitId: string) => void;
  handleLogCustomDate: (date: string, outfit?: SavedOutfit, garmentIds?: string[], notes?: string) => void;
  handleResetToDemo: () => Promise<void>;
  handleImportData: (garments: GarmentItem[], outfits: SavedOutfit[]) => void;
}

export function useWardrobeStore(initialData?: {
  garments?: GarmentItem[];
  savedOutfits?: SavedOutfit[];
  wearLogs?: WearLogEntry[];
  language?: Language;
}) {
  const [garments, setGarments] = useState<GarmentItem[]>(initialData?.garments ?? INITIAL_GARMENTS);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>(initialData?.savedOutfits ?? INITIAL_OUTFITS);
  const [wearLogs, setWearLogs] = useState<WearLogEntry[]>(initialData?.wearLogs ?? INITIAL_WEAR_LOGS);
  const [language, setLanguage] = useState<Language>(initialData?.language ?? 'es');
  const [loaded, setLoaded] = useState(false);

  useWardrobeSync(garments, setGarments, loaded);
  useOutfitsSync(savedOutfits, setSavedOutfits, loaded);
  useWearLogsSync(wearLogs, setWearLogs, loaded);
  useLanguageSync(language, setLanguage, loaded);

  const resolveOutfitItems = useCallback((outfit: SavedOutfit) => {
    return outfit.garmentIds
      .map(id => garments.find(g => g.id === id))
      .filter((g): g is GarmentItem => !!g);
  }, [garments]);

  const handleLogWear = useCallback((e: React.MouseEvent | undefined, garment: GarmentItem) => {
    if (e) e.stopPropagation();
    trackEvent('log_wear', { garmentId: garment.id, category: garment.category });
    const today = new Date().toISOString().split('T')[0];

    setGarments(prev => prev.map(g =>
      g.id === garment.id ? { ...g, wornCount: g.wornCount + 1, lastWorn: today } : g
    ));

    const newLog: WearLogEntry = {
      id: `l-${crypto.randomUUID()}`,
      date: today,
      garmentIds: [garment.id],
      notes: language === 'es' ? `Uso individual registrado: ${garment.nameEs || garment.name}` : `Single wear logged: ${garment.name}`,
    };
    setWearLogs(prev => [newLog, ...prev]);
  }, [language]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent | undefined, garmentId: string) => {
    if (e) e.stopPropagation();
    setGarments(prev => prev.map(g =>
      g.id === garmentId ? { ...g, favorite: !g.favorite } : g
    ));
  }, []);

  const handleDeleteGarment = useCallback((garmentId: string) => {
    setGarments(prev => prev.filter(g => g.id !== garmentId));
    setSavedOutfits(prev => prev.map(o => ({
      ...o,
      garmentIds: o.garmentIds.filter(id => id !== garmentId),
    })));
  }, []);

  const handleUpdateNotes = useCallback((garmentId: string, newNotes: string) => {
    setGarments(prev => prev.map(g => {
      if (g.id !== garmentId) return g;
      return language === 'es'
        ? { ...g, notesEs: newNotes, notes: newNotes }
        : { ...g, notes: newNotes };
    }));
  }, [language]);

  const handleAddGarment = useCallback((newGarmentData: Omit<GarmentItem, 'id'>) => {
    const newGarment: GarmentItem = { ...newGarmentData, id: `g-${crypto.randomUUID()}` };
    setGarments(prev => [newGarment, ...prev]);
  }, []);

  const handleUpdateGarment = useCallback((id: string, data: Partial<GarmentItem>) => {
    setGarments(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
  }, []);

  const handleSaveOutfit = useCallback((outfitData: Omit<SavedOutfit, 'id' | 'createdAt'>) => {
    trackEvent('save_outfit', { pieceCount: outfitData.garmentIds.length });
    const newOutfit: SavedOutfit = {
      ...outfitData,
      id: `o-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSavedOutfits(prev => [newOutfit, ...prev]);
  }, []);

  const handleLogOutfitWear = useCallback((outfit: SavedOutfit) => {
    trackEvent('log_outfit_wear', { outfitId: outfit.id, pieceCount: outfit.garmentIds.length });
    const today = new Date().toISOString().split('T')[0];
    const outfitItems = resolveOutfitItems(outfit);
    const outfitItemIds = outfitItems.map(i => i.id);
    if (outfitItemIds.length === 0) return;

    setSavedOutfits(prev => prev.map(o =>
      o.id === outfit.id ? { ...o, wornCount: o.wornCount + 1, lastWorn: today } : o
    ));
    setGarments(prev => prev.map(g =>
      outfitItemIds.includes(g.id) ? { ...g, wornCount: g.wornCount + 1, lastWorn: today } : g
    ));

    const newLog: WearLogEntry = {
      id: `l-${crypto.randomUUID()}`,
      date: today,
      garmentIds: outfitItemIds,
      outfitId: outfit.id,
      outfitName: language === 'es' && outfit.nameEs ? outfit.nameEs : outfit.name,
      notes: language === 'es' ? `Conjunto usado: ${outfit.nameEs || outfit.name}` : `Outfit worn: ${outfit.name}`,
    };
    setWearLogs(prev => [newLog, ...prev]);
  }, [language, resolveOutfitItems]);

  const handleDeleteOutfit = useCallback((outfitId: string) => {
    setSavedOutfits(prev => prev.filter(o => o.id !== outfitId));
  }, []);

  const handleLogCustomDate = useCallback((date: string, outfit?: SavedOutfit, garmentIds?: string[], notes?: string) => {
    let targetIds: string[] = [];
    if (outfit) {
      targetIds = resolveOutfitItems(outfit).map(i => i.id);
    } else if (garmentIds) {
      targetIds = garmentIds;
    }
    if (targetIds.length === 0 && !notes) return;

    if (targetIds.length > 0) {
      setGarments(prev => prev.map(g =>
        targetIds.includes(g.id)
          ? { ...g, wornCount: g.wornCount + 1, lastWorn: date > (g.lastWorn || '') ? date : g.lastWorn }
          : g
      ));
    }
    if (outfit) {
      setSavedOutfits(prev => prev.map(o =>
        o.id === outfit.id ? { ...o, wornCount: o.wornCount + 1, lastWorn: date } : o
      ));
    }

    const newLog: WearLogEntry = {
      id: `l-${crypto.randomUUID()}`,
      date,
      garmentIds: targetIds,
      outfitId: outfit?.id,
      outfitName: outfit ? (language === 'es' && outfit.nameEs ? outfit.nameEs : outfit.name) : undefined,
      notes,
    };
    setWearLogs(prev => [newLog, ...prev]);
  }, [language, resolveOutfitItems]);

  const handleImportData = useCallback((importedGarments: GarmentItem[], importedOutfits: SavedOutfit[]) => {
    setGarments(importedGarments);
    setSavedOutfits(importedOutfits);
  }, []);

  const handleResetToDemo = useCallback(async () => {
    try {
      setGarments(INITIAL_GARMENTS);
      setSavedOutfits(INITIAL_OUTFITS);
      setWearLogs(INITIAL_WEAR_LOGS);
      setLanguage('es');
      await Promise.all([
        db.clear('garments'),
        db.clear('outfits'),
        db.clear('logs'),
        db.clear('lang'),
      ]);
      await Promise.all([
        db.putAll('garments', INITIAL_GARMENTS),
        db.putAll('outfits', INITIAL_OUTFITS),
        db.putAll('logs', INITIAL_WEAR_LOGS),
        db.put('lang', { key: 'language', value: 'es' }),
      ]);
    } catch {
      toast.error('Error resetting data');
    }
  }, []);

  return {
    garments, savedOutfits, wearLogs, language, loaded,
    setLanguage, setGarments, setSavedOutfits, setWearLogs, setLoaded,
    handleLogWear, handleToggleFavorite, handleDeleteGarment, handleUpdateNotes,
    handleAddGarment, handleUpdateGarment, handleSaveOutfit, handleLogOutfitWear,
    handleDeleteOutfit, handleLogCustomDate, handleResetToDemo, handleImportData,
  };
}
