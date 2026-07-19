import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAccessibleModal } from '@/hooks/useAccessibleModal';

describe('useAccessibleModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns modalRef and closeOnBackdrop', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() =>
      useAccessibleModal({
        isOpen: true,
        onClose,
      })
    );

    expect(result.current.modalRef).toBeDefined();
    expect(result.current.closeOnBackdrop).toBe(true);
  });

  it('sets closeOnBackdrop to false when configured', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() =>
      useAccessibleModal({
        isOpen: true,
        onClose,
        closeOnBackdrop: false,
      })
    );

    expect(result.current.closeOnBackdrop).toBe(false);
  });

  it('adds overflow hidden to body when open', () => {
    const onClose = vi.fn();
    renderHook(() =>
      useAccessibleModal({
        isOpen: true,
        onClose,
      })
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores overflow when closed', () => {
    const onClose = vi.fn();
    const { rerender } = renderHook(
      ({ isOpen }) =>
        useAccessibleModal({
          isOpen,
          onClose,
        }),
      { initialProps: { isOpen: true } }
    );

    rerender({ isOpen: false });

    expect(document.body.style.overflow).toBe('');
  });

  it('handles Escape key', () => {
    const onClose = vi.fn();
    renderHook(() =>
      useAccessibleModal({
        isOpen: true,
        onClose,
      })
    );

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('does not close on Escape when closeOnEscape is false', () => {
    const onClose = vi.fn();
    renderHook(() =>
      useAccessibleModal({
        isOpen: true,
        onClose,
        closeOnEscape: false,
      })
    );

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});
