import { describe, it, expect } from 'vitest';
import {
  sanitizeText,
  validateGarmentName,
  validateImageUrl,
  validateNotes,
  validateMaterial,
  clampWornCount,
  MAX_NAME_LENGTH,
  MAX_NOTES_LENGTH,
  MAX_MATERIAL_LENGTH,
  MAX_URL_LENGTH,
} from './validation';

describe('sanitizeText', () => {
  it('escapes HTML characters', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('escapes single quotes', () => {
    expect(sanitizeText("it's")).toBe('it&#x27;s');
  });

  it('escapes ampersand', () => {
    expect(sanitizeText('a & b')).toBe('a &amp; b');
  });

  it('leaves normal text unchanged', () => {
    expect(sanitizeText('Hello World')).toBe('Hello World');
  });
});

describe('validateGarmentName', () => {
  it('returns null for valid name', () => {
    expect(validateGarmentName('Blue Shirt')).toBeNull();
  });

  it('returns error for empty name', () => {
    expect(validateGarmentName('')).toBe('Name is required');
  });

  it('returns error for whitespace-only name', () => {
    expect(validateGarmentName('   ')).toBe('Name is required');
  });

  it('returns error for name exceeding max length', () => {
    expect(validateGarmentName('a'.repeat(MAX_NAME_LENGTH + 1))).toBe(`Name must be ${MAX_NAME_LENGTH} characters or less`);
  });

  it('returns null for name at max length', () => {
    expect(validateGarmentName('a'.repeat(MAX_NAME_LENGTH))).toBeNull();
  });

  it('returns error for dangerous characters', () => {
    expect(validateGarmentName('Hello <script>')).toBe('Name contains invalid characters');
    expect(validateGarmentName('Hello {brace}')).toBe('Name contains invalid characters');
  });
});

describe('validateImageUrl', () => {
  it('returns null for empty URL (optional field)', () => {
    expect(validateImageUrl('')).toBeNull();
  });

  it('returns null for valid http URL', () => {
    expect(validateImageUrl('https://example.com/image.jpg')).toBeNull();
  });

  it('returns null for data URL', () => {
    expect(validateImageUrl('data:image/png;base64,abc')).toBeNull();
  });

  it('returns error for URL exceeding max length', () => {
    expect(validateImageUrl('https://x.com/' + 'a'.repeat(MAX_URL_LENGTH))).toBe('URL is too long');
  });

  it('returns error for invalid URL scheme', () => {
    expect(validateImageUrl('ftp://example.com/img.jpg')).toBe('URL must be a valid image URL (jpg, png, webp)');
  });
});

describe('validateNotes', () => {
  it('returns null for valid notes', () => {
    expect(validateNotes('Nice and comfy')).toBeNull();
  });

  it('returns null for empty notes', () => {
    expect(validateNotes('')).toBeNull();
  });

  it('returns error for notes exceeding max length', () => {
    expect(validateNotes('a'.repeat(MAX_NOTES_LENGTH + 1))).toBe(`Notes must be ${MAX_NOTES_LENGTH} characters or less`);
  });

  it('returns error for dangerous characters', () => {
    expect(validateNotes('Contains <html>')).toBe('Notes contain invalid characters');
  });
});

describe('validateMaterial', () => {
  it('returns null for valid material', () => {
    expect(validateMaterial('Cotton')).toBeNull();
  });

  it('returns null for empty material', () => {
    expect(validateMaterial('')).toBeNull();
  });

  it('returns error for material exceeding max length', () => {
    expect(validateMaterial('a'.repeat(MAX_MATERIAL_LENGTH + 1))).toBe(`Material must be ${MAX_MATERIAL_LENGTH} characters or less`);
  });
});

describe('clampWornCount', () => {
  it('returns 0 for empty string', () => {
    expect(clampWornCount('')).toBe(0);
  });

  it('returns 0 for non-numeric string', () => {
    expect(clampWornCount('abc')).toBe(0);
  });

  it('returns 0 for negative number', () => {
    expect(clampWornCount('-5')).toBe(0);
  });

  it('clamps to 9999 max', () => {
    expect(clampWornCount('10000')).toBe(9999);
  });

  it('returns valid number within range', () => {
    expect(clampWornCount('42')).toBe(42);
  });

  it('handles decimal input', () => {
    expect(clampWornCount('3.14')).toBe(3);
  });
});
