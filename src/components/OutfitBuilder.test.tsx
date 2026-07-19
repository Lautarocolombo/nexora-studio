import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from '../i18n';
import { OutfitBuilder } from './OutfitBuilder';
import { GarmentItem, SeasonTag, SavedOutfit } from '../types';

vi.mock('./GarmentCard', () => ({
  GarmentCard: ({ garment, isSelectableForBuilder, onSelectForBuilder }: {
    garment: GarmentItem;
    isSelectableForBuilder?: boolean;
    onSelectForBuilder?: (item: GarmentItem) => void;
  }) => (
    <div
      data-testid="drawer-garment"
      onClick={() => isSelectableForBuilder && onSelectForBuilder?.(garment)}
    >
      {garment.name}
    </div>
  ),
}));

const mockGarments: GarmentItem[] = [
  { id: 'g-1', category: 'tops', categoryTag: '[TOP]', name: 'Shirt', nameEs: 'Camisa', imageUrl: 'https://example.com/test.jpg', season: 'spring-summer' as SeasonTag, wornCount: 10, lastWorn: '2025-01-01', favorite: false, material: 'Cotton', notes: '', notesEs: '' },
  { id: 'g-2', category: 'bottoms', categoryTag: '[BOTTOM]', name: 'Pants', nameEs: 'Pantalón', imageUrl: 'https://example.com/test.jpg', season: 'all-year' as SeasonTag, wornCount: 5, lastWorn: '2025-01-01', favorite: false, material: 'Denim', notes: '', notesEs: '' },
  { id: 'g-3', category: 'shoes', categoryTag: '[SHOES]', name: 'Shoes', nameEs: 'Zapatos', imageUrl: 'https://example.com/test.jpg', season: 'all-year' as SeasonTag, wornCount: 15, lastWorn: '2025-01-01', favorite: false, material: 'Leather', notes: '', notesEs: '' },
];

const mockSavedOutfits: SavedOutfit[] = [
  { id: 'so-1', name: 'Casual Combo', garmentIds: ['g-1', 'g-2', 'g-3'], occasion: 'Casual', wornCount: 3, createdAt: '2025-01-01', harmonyScore: 92 },
];

describe('OutfitBuilder', () => {
  const defaultProps = {
    garments: mockGarments,
    savedOutfits: mockSavedOutfits,
    onSaveOutfit: vi.fn(),
    onLogOutfitWear: vi.fn(),
    onDeleteOutfit: vi.fn(),
    language: 'en' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    i18n.changeLanguage('en');
  });

  it('renders the outfit builder title', () => {
    render(<OutfitBuilder {...defaultProps} />);
    expect(screen.getByText('Outfit Builder')).toBeDefined();
  });

  it('renders subtitle', () => {
    render(<OutfitBuilder {...defaultProps} />);
    expect(screen.getByText(/Combine pieces/)).toBeDefined();
  });

  it('renders 4 outfit slot buttons', () => {
    render(<OutfitBuilder {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Select top' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Select bottom' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Select shoes' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Select outerwear or accessory' })).toBeDefined();
  });

  it('displays drawer tabs', () => {
    render(<OutfitBuilder {...defaultProps} />);
    expect(screen.getByText('Tops / Shirts')).toBeDefined();
    expect(screen.getByText('Bottoms')).toBeDefined();
    expect(screen.getAllByText('Shoes').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Outerwear & Acc')).toBeDefined();
  });

  it('renders garment cards in drawer', () => {
    render(<OutfitBuilder {...defaultProps} />);
    const drawerGarments = screen.getAllByTestId('drawer-garment');
    expect(drawerGarments.length).toBeGreaterThan(0);
  });

  it('shows random inspire button', () => {
    render(<OutfitBuilder {...defaultProps} />);
    expect(screen.getByText('Random Inspire')).toBeDefined();
  });

  it('shows save outfit button', () => {
    render(<OutfitBuilder {...defaultProps} />);
    expect(screen.getByText('Save Outfit')).toBeDefined();
  });

  it('shows saved outfits section', () => {
    render(<OutfitBuilder {...defaultProps} />);
    expect(screen.getByText(/Saved Outfits/)).toBeDefined();
  });

  it('shows empty outfit info', () => {
    render(<OutfitBuilder {...defaultProps} />);
    expect(screen.getByText('Total Pieces')).toBeDefined();
    expect(screen.getByText('Versatility')).toBeDefined();
  });
});
