import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import i18n from '../i18n';
import { AddGarmentModal } from '@/components/AddGarmentModal';

describe('AddGarmentModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onAddGarment: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    i18n.changeLanguage('es');
  });

  it('renders when open', () => {
    render(<AddGarmentModal {...defaultProps} />);
    expect(screen.getByText('Añadir Prenda a tu Armario')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<AddGarmentModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Añadir Prenda a tu Armario')).not.toBeInTheDocument();
  });

  it('renders form fields', () => {
    render(<AddGarmentModal {...defaultProps} />);
    expect(screen.getByLabelText(/Nombre de la Prenda/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Temporada/i)).toBeInTheDocument();
  });

  it('calls onClose when cancel clicked', () => {
    render(<AddGarmentModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancelar'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onAddGarment when form submitted', () => {
    render(<AddGarmentModal {...defaultProps} />);
    const nameInput = screen.getByLabelText(/Nombre de la Prenda/i);
    fireEvent.change(nameInput, { target: { value: 'Test Garment' } });
    fireEvent.submit(screen.getByText('Guardar en Armario').closest('form') as HTMLFormElement);
    expect(defaultProps.onAddGarment).toHaveBeenCalled();
  });

  it('renders in English when language is en', () => {
    i18n.changeLanguage('en');
    render(<AddGarmentModal {...defaultProps} />);
    expect(screen.getByText('Add Garment to Your Wardrobe')).toBeInTheDocument();
  });
});
