import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls handler when matching key pressed', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts([{ key: 'n', handler, description: 'New' }]));

    const event = new KeyboardEvent('keydown', { key: 'n' });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call handler when key does not match', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts([{ key: 'n', handler, description: 'New' }]));

    const event = new KeyboardEvent('keydown', { key: 'x' });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('does not call handler when disabled', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts([{ key: 'n', handler, description: 'New' }], false));

    const event = new KeyboardEvent('keydown', { key: 'n' });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('handles ctrl modifier', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts([{ key: 's', handler, description: 'Save', ctrl: true }]));

    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call handler when ctrl required but not pressed', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts([{ key: 's', handler, description: 'Save', ctrl: true }]));

    const event = new KeyboardEvent('keydown', { key: 's' });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('handles shift modifier', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts([{ key: 'a', handler, description: 'Select All', shift: true }]));

    const event = new KeyboardEvent('keydown', { key: 'a', shiftKey: true });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('handles multiple shortcuts', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    renderHook(() => useKeyboardShortcuts([
      { key: 'n', handler: handler1, description: 'New' },
      { key: 'b', handler: handler2, description: 'Builder' },
    ]));

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }));
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it('cleans up event listener on unmount', () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useKeyboardShortcuts([{ key: 'n', handler, description: 'New' }]));

    unmount();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }));

    expect(handler).not.toHaveBeenCalled();
  });
});
