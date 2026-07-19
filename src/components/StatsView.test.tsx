import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import i18n from '../i18n';
import { StatsView } from './StatsView';
import { GarmentItem } from '../types';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-container">{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
}));

const mockGarments: GarmentItem[] = [
  { id: 'g-1', category: 'tops', categoryTag: '[TOP]', name: 'Shirt A', nameEs: 'Camisa A', imageUrl: 'https://example.com/a.jpg', season: 'all-year', wornCount: 20, lastWorn: '2025-01-01', favorite: false, material: 'Cotton', notes: '', notesEs: '' },
  { id: 'g-2', category: 'bottoms', categoryTag: '[BOTTOM]', name: 'Pants B', nameEs: 'Pantalón B', imageUrl: 'https://example.com/b.jpg', season: 'all-year', wornCount: 5, lastWorn: '2025-01-01', favorite: false, material: 'Denim', notes: '', notesEs: '' },
  { id: 'g-3', category: 'shoes', categoryTag: '[SHOES]', name: 'Shoes C', nameEs: 'Zapatos C', imageUrl: 'https://example.com/c.jpg', season: 'all-year', wornCount: 15, lastWorn: '2025-01-01', favorite: true, material: 'Leather', notes: '', notesEs: '' },
  { id: 'g-4', category: 'outerwear', categoryTag: '[OUTERWEAR]', name: 'Jacket D', nameEs: 'Abrigo D', imageUrl: 'https://example.com/d.jpg', season: 'autumn-winter', wornCount: 1, lastWorn: '2025-01-01', favorite: false, material: 'Wool', notes: '', notesEs: '' },
];

describe('StatsView', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
  });

  it('renders title and subtitle', () => {
    render(<StatsView garments={mockGarments} language="en" onSelectForBuilder={() => {}} onNavigateToBuilder={() => {}} />);
    expect(screen.getByText('Style & Wear Statistics')).toBeDefined();
  });

  it('displays correct total items count', () => {
    render(<StatsView garments={mockGarments} language="en" onSelectForBuilder={() => {}} onNavigateToBuilder={() => {}} />);
    expect(screen.getByText('4')).toBeDefined();
  });

  it('displays total wears', () => {
    render(<StatsView garments={mockGarments} language="en" onSelectForBuilder={() => {}} onNavigateToBuilder={() => {}} />);
    expect(screen.getByText('41')).toBeDefined();
  });

  it('shows top worn items', () => {
    render(<StatsView garments={mockGarments} language="en" onSelectForBuilder={() => {}} onNavigateToBuilder={() => {}} />);
    expect(screen.getByText('Most Worn')).toBeDefined();
    expect(screen.getAllByText('Shirt A').length).toBeGreaterThanOrEqual(1);
  });

  it('shows neglected items', () => {
    render(<StatsView garments={mockGarments} language="en" onSelectForBuilder={() => {}} onNavigateToBuilder={() => {}} />);
    expect(screen.getByText('Least Worn')).toBeDefined();
  });

  it('calls onNavigateToBuilder when equip button clicked', () => {
    const onNavigate = vi.fn();
    render(<StatsView garments={mockGarments} language="en" onSelectForBuilder={() => {}} onNavigateToBuilder={onNavigate} />);
    const equipButtons = screen.getAllByText('Use in Next Outfit');
    fireEvent.click(equipButtons[0]);
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('renders in Spanish when language=es', () => {
    i18n.changeLanguage('es');
    render(<StatsView garments={mockGarments} language="es" onSelectForBuilder={() => {}} onNavigateToBuilder={() => {}} />);
    expect(screen.getByText('Estadísticas de Estilo & Uso')).toBeDefined();
    expect(screen.getAllByText('Camisa A').length).toBeGreaterThanOrEqual(1);
  });

  it('renders charts section', () => {
    render(<StatsView garments={mockGarments} language="en" onSelectForBuilder={() => {}} onNavigateToBuilder={() => {}} />);
    expect(screen.getByText('Wears by Category')).toBeDefined();
    expect(screen.getByText('Wardrobe Composition')).toBeDefined();
  });

  it('handles empty garments', () => {
    render(<StatsView garments={[]} language="en" onSelectForBuilder={() => {}} onNavigateToBuilder={() => {}} />);
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
  });
});
