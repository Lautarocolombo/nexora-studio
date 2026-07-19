import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GarmentCard } from '@/components/GarmentCard';
import { GarmentItem } from '@/types';

const mockGarment: GarmentItem = {
  id: 'g-1',
  name: 'White Linen Shirt',
  nameEs: 'Camisa de Lino Blanco',
  category: 'tops',
  categoryTag: '[TOP]',
  imageUrl: 'https://example.com/shirt.jpg',
  wornCount: 15,
  lastWorn: '2026-07-15',
  material: '100% Linen',
  season: 'spring-summer',
  favorite: true,
  colorSwatch: '#F7F3EC',
};

describe('GarmentCard', () => {
  const defaultProps = {
    garment: mockGarment,
    language: 'es' as const,
    onCardClick: vi.fn(),
    onLogWear: vi.fn(),
    onToggleFavorite: vi.fn(),
  };

  it('renders garment name in Spanish when language is es', () => {
    render(<GarmentCard {...defaultProps} />);
    expect(screen.getByText('Camisa de Lino Blanco')).toBeInTheDocument();
  });

  it('renders garment name in English when language is en', () => {
    render(<GarmentCard {...defaultProps} language="en" />);
    expect(screen.getByText('White Linen Shirt')).toBeInTheDocument();
  });

  it('displays worn count text', () => {
    render(<GarmentCard {...defaultProps} />);
    expect(screen.getByText(/Usado 15 veces/)).toBeInTheDocument();
  });

  it('displays category tag', () => {
    render(<GarmentCard {...defaultProps} />);
    expect(screen.getByText('[TOP]')).toBeInTheDocument();
  });

  it('calls onCardClick when card clicked', () => {
    render(<GarmentCard {...defaultProps} />);
    const card = screen.getByRole('button', { name: /Camisa de Lino Blanco/ });
    fireEvent.click(card);
    expect(defaultProps.onCardClick).toHaveBeenCalledWith(mockGarment);
  });

  it('shows favorite heart when favorited', () => {
    render(<GarmentCard {...defaultProps} />);
    const heartButton = screen.getByRole('button', { name: /Marcar como favorito/i });
    expect(heartButton).toBeInTheDocument();
  });

  it('calls onToggleFavorite when heart clicked', () => {
    render(<GarmentCard {...defaultProps} />);
    const heartButton = screen.getByRole('button', { name: /Marcar como favorito/i });
    fireEvent.click(heartButton);
    expect(defaultProps.onToggleFavorite).toHaveBeenCalled();
  });

  it('applies selected ring when isSelectedForBuilder is true', () => {
    render(<GarmentCard {...defaultProps} isSelectableForBuilder isSelectedForBuilder />);
    const card = screen.getByRole('button', { name: /Camisa de Lino Blanco/ });
    expect(card.className).toContain('ring-2');
  });
});
