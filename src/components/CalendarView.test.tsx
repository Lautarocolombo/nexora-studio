import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from '../i18n';
import { CalendarView } from './CalendarView';

describe('CalendarView', () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const baseProps = {
    language: 'en' as const,
    wearLogs: [
      { id: 'log-1', date: `${year}-${month}-15`, garmentIds: ['g-1', 'g-2'], outfitName: null },
      { id: 'log-2', date: `${year}-${month}-18`, garmentIds: ['g-3'], outfitName: 'Beach Day' },
    ],
    garments: [
      { id: 'g-1', category: 'tops' as const, categoryTag: '[TOP]', name: 'Shirt', nameEs: 'Camisa', imageUrl: 'https://example.com/test.jpg', season: 'spring-summer' as const, wornCount: 10, lastWorn: `${year}-${month}-15`, favorite: false, material: '', notes: '', notesEs: '' },
      { id: 'g-2', category: 'bottoms' as const, categoryTag: '[BOTTOM]', name: 'Pants', nameEs: 'Pantalón', imageUrl: 'https://example.com/test.jpg', season: 'all-year' as const, wornCount: 5, lastWorn: `${year}-${month}-15`, favorite: false, material: '', notes: '', notesEs: '' },
      { id: 'g-3', category: 'shoes' as const, categoryTag: '[SHOES]', name: 'Shoes', nameEs: 'Zapatos', imageUrl: 'https://example.com/test.jpg', season: 'all-year' as const, wornCount: 15, lastWorn: `${year}-${month}-18`, favorite: false, material: '', notes: '', notesEs: '' },
    ],
    savedOutfits: [
      { id: 'so-1', name: 'Summer Look', nameEs: 'Look de Verano', garmentIds: ['g-1', 'g-2'], occasion: 'Casual', occasionEs: 'Casual', wornCount: 3, lastWorn: `${year}-${month}-10`, createdAt: `${year}-${month}-01`, harmonyScore: 92 },
    ],
    onLogCustomDate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    i18n.changeLanguage('en');
  });

  it('renders the calendar title', () => {
    render(<CalendarView {...baseProps} />);
    expect(screen.getByText('Mindful Wear Log & Calendar')).toBeDefined();
  });

  it('shows current month', () => {
    render(<CalendarView {...baseProps} />);
    const monthName = now.toLocaleString('en-US', { month: 'long' });
    expect(screen.getByText(new RegExp(monthName + '.*' + String(year)))).toBeDefined();
  });

  it('shows day headers', () => {
    render(<CalendarView {...baseProps} />);
    expect(screen.getByText('Sun')).toBeDefined();
    expect(screen.getByText('Mon')).toBeDefined();
    expect(screen.getByText('Sat')).toBeDefined();
  });

  it('shows wear log labels on calendar grid', () => {
    render(<CalendarView {...baseProps} />);
    expect(screen.getAllByText('Beach Day').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('2 garments logged').length).toBeGreaterThanOrEqual(1);
  });

  it('shows recent wear history section', () => {
    render(<CalendarView {...baseProps} />);
    expect(screen.getByText('Recent Wear History')).toBeDefined();
  });

  it('renders calendar day cells', () => {
    const { container } = render(<CalendarView {...baseProps} />);
    const dayCells = container.querySelectorAll('[class*="min-h-"][class*="cursor-pointer"]');
    expect(dayCells.length).toBeGreaterThanOrEqual(28);
  });

  it('shows navigation arrows', () => {
    const { container } = render(<CalendarView {...baseProps} />);
    const navButtons = container.querySelectorAll('button');
    expect(navButtons.length).toBeGreaterThanOrEqual(2);
  });

  it('shows garment count in logs', () => {
    render(<CalendarView {...baseProps} />);
    expect(screen.getAllByText(/\(\d+ items?\)/).length).toBeGreaterThanOrEqual(1);
  });
});
