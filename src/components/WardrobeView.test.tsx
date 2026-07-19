import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import i18n from '../i18n';
import { WardrobeView } from './WardrobeView';
import { GarmentItem } from '../types';

vi.mock('./GarmentCard', () => ({
  GarmentCard: ({ garment, onCardClick }: { garment: GarmentItem; onCardClick?: () => void }) => (
    <div data-testid="garment-card" data-id={garment.id} onClick={onCardClick}>
      {garment.name}
    </div>
  ),
}));

const mockGarments: GarmentItem[] = [
  { id: 'g-1', category: 'tops', categoryTag: '[TOP]', name: 'Shirt A', nameEs: 'Camisa A', imageUrl: 'https://example.com/test.jpg', season: 'spring-summer', wornCount: 20, lastWorn: '2025-01-01', favorite: true, material: 'Cotton', notes: '', notesEs: '' },
  { id: 'g-2', category: 'bottoms', categoryTag: '[BOTTOM]', name: 'Pants B', nameEs: 'Pantalón B', imageUrl: 'https://example.com/test.jpg', season: 'autumn-winter', wornCount: 5, lastWorn: '2025-01-01', favorite: false, material: 'Denim', notes: '', notesEs: '' },
  { id: 'g-3', category: 'shoes', categoryTag: '[SHOES]', name: 'Shoes C', nameEs: 'Zapatos C', imageUrl: 'https://example.com/test.jpg', season: 'autumn-winter', wornCount: 15, lastWorn: '2025-01-01', favorite: false, material: 'Leather', notes: '', notesEs: '' },
];

describe('WardrobeView', () => {
  const defaultProps = {
    garments: mockGarments,
    language: 'en' as const,
    onCardClick: vi.fn(),
    onLogWear: vi.fn(),
    onToggleFavorite: vi.fn(),
    onOpenAddModal: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    i18n.changeLanguage('en');
  });

  it('renders title and item count', () => {
    render(<WardrobeView {...defaultProps} />);
    expect(screen.getByText('Your Wardrobe')).toBeDefined();
    expect(screen.getByText(/items cataloged/)).toBeDefined();
  });

  it('renders all garments', () => {
    render(<WardrobeView {...defaultProps} />);
    const cards = screen.getAllByTestId('garment-card');
    expect(cards.length).toBe(3);
  });

  it('filters by category', () => {
    render(<WardrobeView {...defaultProps} />);
    fireEvent.click(screen.getByText('Tops'));
    const cards = screen.getAllByTestId('garment-card');
    expect(cards.length).toBe(1);
    expect(cards[0]).toHaveTextContent('Shirt A');
  });

  it('filters by season', () => {
    render(<WardrobeView {...defaultProps} />);
    const seasonSelect = screen.getByDisplayValue('All Seasons');
    fireEvent.change(seasonSelect, { target: { value: 'spring-summer' } });
    const cards = screen.getAllByTestId('garment-card');
    expect(cards.length).toBe(1);
  });

  it('searches garments', () => {
    render(<WardrobeView {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Search wardrobe...');
    fireEvent.change(searchInput, { target: { value: 'Pants' } });
    const cards = screen.getAllByTestId('garment-card');
    expect(cards.length).toBe(1);
    expect(cards[0]).toHaveTextContent('Pants B');
  });

  it('clears search when clear button clicked', () => {
    render(<WardrobeView {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText('Search wardrobe...');
    fireEvent.change(searchInput, { target: { value: 'Pants' } });
    expect(screen.getAllByTestId('garment-card').length).toBe(1);
    fireEvent.click(screen.getByLabelText('Clear search'));
    expect(screen.getAllByTestId('garment-card').length).toBe(3);
  });

  it('sorts by name', () => {
    render(<WardrobeView {...defaultProps} />);
    const sortSelect = screen.getByDisplayValue('Most Worn');
    fireEvent.change(sortSelect, { target: { value: 'name' } });
    const cards = screen.getAllByTestId('garment-card');
    expect(cards[0]).toHaveTextContent('Pants B');
    expect(cards[1]).toHaveTextContent('Shirt A');
    expect(cards[2]).toHaveTextContent('Shoes C');
  });

  it('shows empty state with no garments', () => {
    render(<WardrobeView {...defaultProps} garments={[]} />);
    expect(screen.getByText('No garments found')).toBeDefined();
    fireEvent.click(screen.getByText('Add Garment'));
    expect(defaultProps.onOpenAddModal).toHaveBeenCalled();
  });

  it('calls onCardClick when card clicked', () => {
    render(<WardrobeView {...defaultProps} />);
    fireEvent.click(screen.getAllByTestId('garment-card')[0]);
    expect(defaultProps.onCardClick).toHaveBeenCalled();
  });

  it('filters favorites', () => {
    render(<WardrobeView {...defaultProps} />);
    fireEvent.click(screen.getByText('Favorites'));
    const cards = screen.getAllByTestId('garment-card');
    expect(cards.length).toBe(1);
    expect(cards[0]).toHaveTextContent('Shirt A');
  });
});
