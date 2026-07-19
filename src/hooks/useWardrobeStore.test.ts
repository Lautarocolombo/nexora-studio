import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWardrobeStore } from '../hooks/useWardrobeStore';
import { GarmentItem, SavedOutfit } from '../types';

vi.mock('../hooks/useSync', () => ({
  useWardrobeSync: vi.fn(),
  useOutfitsSync: vi.fn(),
  useWearLogsSync: vi.fn(),
  useLanguageSync: vi.fn(),
}));

vi.mock('../hooks/useAnalytics', () => ({
  trackEvent: vi.fn(),
}));

vi.mock('../lib/db', () => ({
  db: {
    clear: vi.fn().mockResolvedValue(undefined),
    putAll: vi.fn().mockResolvedValue(undefined),
    put: vi.fn().mockResolvedValue(undefined),
  },
}));

const mockGarment: GarmentItem = {
  id: 'g-test-1',
  category: 'tops',
  categoryTag: '[TOP]',
  name: 'Test Shirt',
  nameEs: 'Camisa Test',
  imageUrl: 'https://example.com/shirt.jpg',
  season: 'all-year',
  wornCount: 5,
  lastWorn: '2025-01-01',
  favorite: false,
  material: 'Cotton',
  notes: '',
  notesEs: '',
};

const mockOutfit: SavedOutfit = {
  id: 'o-test-1',
  name: 'Test Outfit',
  nameEs: 'Atuendo Test',
  garmentIds: ['g-test-1'],
  occasion: 'Casual',
  occasionEs: 'Casual',
  wornCount: 2,
  lastWorn: '2025-01-01',
  harmonyScore: 90,
  createdAt: '2025-01-01',
};

describe('useWardrobeStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default data', () => {
    const { result } = renderHook(() => useWardrobeStore());
    expect(result.current.garments).toBeDefined();
    expect(result.current.garments.length).toBeGreaterThan(0);
    expect(result.current.savedOutfits).toBeDefined();
    expect(result.current.wearLogs).toBeDefined();
    expect(result.current.language).toBe('es');
  });

  it('initializes with provided data', () => {
    const { result } = renderHook(() => useWardrobeStore({
      garments: [mockGarment],
      savedOutfits: [mockOutfit],
      wearLogs: [],
      language: 'en',
    }));
    expect(result.current.garments).toHaveLength(1);
    expect(result.current.garments[0].id).toBe('g-test-1');
    expect(result.current.savedOutfits).toHaveLength(1);
    expect(result.current.language).toBe('en');
  });

  it('handleAddGarment adds a garment', () => {
    const { result } = renderHook(() => useWardrobeStore({ garments: [] }));
    act(() => {
      result.current.handleAddGarment({
        category: 'tops',
        categoryTag: '[TOP]',
        name: 'New Shirt',
        imageUrl: 'https://example.com/new.jpg',
        season: 'all-year',
        wornCount: 0,
        favorite: false,
        material: '',
        notes: '',
      });
    });
    expect(result.current.garments).toHaveLength(1);
    expect(result.current.garments[0].name).toBe('New Shirt');
    expect(result.current.garments[0].id).toMatch(/^g-/);
  });

  it('handleDeleteGarment removes garment and cleans outfits', () => {
    const { result } = renderHook(() => useWardrobeStore({
      garments: [mockGarment],
      savedOutfits: [mockOutfit],
    }));
    act(() => {
      result.current.handleDeleteGarment('g-test-1');
    });
    expect(result.current.garments).toHaveLength(0);
    expect(result.current.savedOutfits[0].garmentIds).toHaveLength(0);
  });

  it('handleLogWear increments wornCount and creates log', () => {
    const { result } = renderHook(() => useWardrobeStore({
      garments: [mockGarment],
      wearLogs: [],
    }));
    act(() => {
      result.current.handleLogWear(undefined, mockGarment);
    });
    expect(result.current.garments[0].wornCount).toBe(6);
    expect(result.current.wearLogs).toHaveLength(1);
  });

  it('handleToggleFavorite toggles favorite', () => {
    const { result } = renderHook(() => useWardrobeStore({
      garments: [mockGarment],
    }));
    act(() => {
      result.current.handleToggleFavorite(undefined, 'g-test-1');
    });
    expect(result.current.garments[0].favorite).toBe(true);
    act(() => {
      result.current.handleToggleFavorite(undefined, 'g-test-1');
    });
    expect(result.current.garments[0].favorite).toBe(false);
  });

  it('handleSaveOutfit creates a new outfit', () => {
    const { result } = renderHook(() => useWardrobeStore({ savedOutfits: [] }));
    act(() => {
      result.current.handleSaveOutfit({
        name: 'New Outfit',
        garmentIds: ['g-1'],
        occasion: 'Work',
        wornCount: 0,
        lastWorn: '',
        harmonyScore: 95,
      });
    });
    expect(result.current.savedOutfits).toHaveLength(1);
    expect(result.current.savedOutfits[0].name).toBe('New Outfit');
    expect(result.current.savedOutfits[0].id).toMatch(/^o-/);
  });

  it('handleDeleteOutfit removes outfit', () => {
    const { result } = renderHook(() => useWardrobeStore({
      savedOutfits: [mockOutfit],
    }));
    act(() => {
      result.current.handleDeleteOutfit('o-test-1');
    });
    expect(result.current.savedOutfits).toHaveLength(0);
  });

  it('handleImportData replaces garments and outfits', () => {
    const { result } = renderHook(() => useWardrobeStore({
      garments: [mockGarment],
      savedOutfits: [mockOutfit],
    }));
    act(() => {
      result.current.handleImportData([], []);
    });
    expect(result.current.garments).toHaveLength(0);
    expect(result.current.savedOutfits).toHaveLength(0);
  });

  it('handleUpdateGarment patches garment data', () => {
    const { result } = renderHook(() => useWardrobeStore({
      garments: [mockGarment],
    }));
    act(() => {
      result.current.handleUpdateGarment('g-test-1', { material: 'Linen' });
    });
    expect(result.current.garments[0].material).toBe('Linen');
    expect(result.current.garments[0].name).toBe('Test Shirt');
  });
});
