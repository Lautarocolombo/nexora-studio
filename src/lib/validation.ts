export const MAX_NAME_LENGTH = 100;
export const MAX_NOTES_LENGTH = 500;
export const MAX_MATERIAL_LENGTH = 150;
export const MAX_URL_LENGTH = 2048;

const URL_REGEX = /^https?:\/\/.+/i;
const DANGEROUS_CHARS = /[<>{}]/;

export function sanitizeText(input: string): string {
  return input.replace(/[<>'"&]/g, (ch) => {
    switch (ch) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#x27;';
      case '&': return '&amp;';
      default: return ch;
    }
  });
}

export function validateGarmentName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Name is required';
  if (trimmed.length > MAX_NAME_LENGTH) return `Name must be ${MAX_NAME_LENGTH} characters or less`;
  if (DANGEROUS_CHARS.test(trimmed)) return 'Name contains invalid characters';
  return null;
}

export function validateImageUrl(url: string): string | null {
  if (!url.trim()) return null;
  if (url.length > MAX_URL_LENGTH) return 'URL is too long';
  if (!URL_REGEX.test(url) && !url.startsWith('data:')) return 'URL must be a valid image URL (jpg, png, webp)';
  return null;
}

export function validateNotes(notes: string): string | null {
  if (notes.length > MAX_NOTES_LENGTH) return `Notes must be ${MAX_NOTES_LENGTH} characters or less`;
  if (DANGEROUS_CHARS.test(notes)) return 'Notes contain invalid characters';
  return null;
}

export function validateMaterial(material: string): string | null {
  if (material.length > MAX_MATERIAL_LENGTH) return `Material must be ${MAX_MATERIAL_LENGTH} characters or less`;
  return null;
}

export function clampWornCount(value: string): number {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < 0) return 0;
  if (num > 9999) return 9999;
  return num;
}
