import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import i18n from '../i18n';
import { AdminPanel } from './AdminPanel';
import { GarmentItem } from '../types';

vi.mock('./admin/AdminGarmentRow', () => ({
  AdminGarmentRow: ({ garment }: { garment: GarmentItem }) => (
    <tr data-testid="admin-row">
      <td>{garment.name}</td>
    </tr>
  ),
}));

const mockGarments: GarmentItem[] = [
  { id: 'g-1', category: 'tops', categoryTag: '[TOP]', name: 'Shirt', nameEs: 'Camisa', imageUrl: 'https://example.com/test.jpg', season: 'spring-summer', wornCount: 10, lastWorn: '2025-01-01', favorite: false, material: 'Cotton', notes: '', notesEs: '' },
  { id: 'g-2', category: 'bottoms', categoryTag: '[BOTTOM]', name: 'Pants', nameEs: 'Pantalón', imageUrl: 'https://example.com/test.jpg', season: 'all-year', wornCount: 5, lastWorn: '2025-01-01', favorite: false, material: 'Denim', notes: '', notesEs: '' },
];

describe('AdminPanel', () => {
  const defaultProps = {
    garments: mockGarments,
    onUpdateGarment: vi.fn(),
    onDeleteGarment: vi.fn(),
    onAddGarment: vi.fn(),
    language: 'en' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    i18n.changeLanguage('en');
  });

  it('renders the admin panel title', () => {
    render(<AdminPanel {...defaultProps} />);
    expect(screen.getByText('Admin Panel')).toBeDefined();
  });

  it('renders subtitle', () => {
    render(<AdminPanel {...defaultProps} />);
    expect(screen.getByText(/Manage garments/)).toBeDefined();
  });

  it('shows total garment count', () => {
    render(<AdminPanel {...defaultProps} />);
    expect(screen.getByText(/Total garments/)).toBeDefined();
  });

  it('renders all garments in table', () => {
    render(<AdminPanel {...defaultProps} />);
    const rows = screen.getAllByTestId('admin-row');
    expect(rows.length).toBe(2);
  });

  it('renders New Garment button', () => {
    render(<AdminPanel {...defaultProps} />);
    expect(screen.getByText('New Garment')).toBeDefined();
  });

  it('shows search input', () => {
    render(<AdminPanel {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search garment...')).toBeDefined();
  });

  it('shows table headers', () => {
    render(<AdminPanel {...defaultProps} />);
    expect(screen.getByText('Name')).toBeDefined();
    expect(screen.getByText('Category')).toBeDefined();
    expect(screen.getByText('Actions')).toBeDefined();
  });

  it('filters garments by search', () => {
    render(<AdminPanel {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Search garment...');
    fireEvent.change(searchInput, { target: { value: 'Shirt' } });
    const rows = screen.getAllByTestId('admin-row');
    expect(rows.length).toBe(1);
  });

  it('shows empty state when no garments match', () => {
    render(<AdminPanel {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Search garment...');
    fireEvent.change(searchInput, { target: { value: 'xyznotfound' } });
    expect(screen.getByText('No garments found')).toBeDefined();
  });
});
