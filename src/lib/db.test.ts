import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '@/lib/db';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('db utility', () => {
  it('exports db object with required methods', () => {
    expect(db).toBeDefined();
    expect(typeof db.getAll).toBe('function');
    expect(typeof db.get).toBe('function');
    expect(typeof db.put).toBe('function');
    expect(typeof db.putAll).toBe('function');
    expect(typeof db.delete).toBe('function');
    expect(typeof db.clear).toBe('function');
  });

  it('getAll throws when indexedDB is not available', async () => {
    await expect(db.getAll('garments')).rejects.toThrow();
  });
});
