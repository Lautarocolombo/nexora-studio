import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSeoMeta } from '@/hooks/useSeoMeta';

describe('useSeoMeta', () => {
  beforeEach(() => {
    document.title = 'Original Title';
    vi.clearAllMocks();
  });

  it('updates document title for wardrobe tab', () => {
    renderHook(() => useSeoMeta('wardrobe', 'es'));
    expect(document.title).toContain('Guardarropa');
  });

  it('updates document title for builder tab in English', () => {
    renderHook(() => useSeoMeta('builder', 'en'));
    expect(document.title).toContain('Outfit Builder');
  });

  it('updates meta description', () => {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      renderHook(() => useSeoMeta('stats', 'es'));
      expect(metaDesc.getAttribute('content')).toContain('Medí qué tan seguido');
    }
  });
});
