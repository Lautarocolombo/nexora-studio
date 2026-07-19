import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../i18n';
import { Navbar } from '@/components/Navbar';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('Navbar', () => {
  const defaultProps = {
    onLogout: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    i18n.changeLanguage('es');
  });

  it('renders brand name', () => {
    render(<Navbar {...defaultProps} />, { wrapper });
    expect(screen.getAllByText('Armario').length).toBeGreaterThan(0);
  });

  it('renders navigation items', () => {
    render(<Navbar {...defaultProps} />, { wrapper });
    expect(screen.getAllByText('Guardarropa').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Constructor').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Calendario').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Estadísticas').length).toBeGreaterThan(0);
  });

  it('links to builder route', () => {
    render(<Navbar {...defaultProps} />, { wrapper });
    const constructors = screen.getAllByText('Constructor');
    const NavLink = constructors[0].closest('a');
    expect(NavLink).toHaveAttribute('href', '/builder');
  });

  it('shows language toggle', () => {
    render(<Navbar {...defaultProps} />, { wrapper });
    expect(screen.getAllByText('ES').length).toBeGreaterThan(0);
  });

  it('calls i18n.changeLanguage when language toggle clicked', () => {
    const spy = vi.spyOn(i18n, 'changeLanguage');
    render(<Navbar {...defaultProps} />, { wrapper });
    const langButtons = screen.getAllByLabelText(/Cambiar idioma/i);
    fireEvent.click(langButtons[0]);
    expect(spy).toHaveBeenCalledWith('en');
    spy.mockRestore();
  });

  it('calls onLogout when logout button clicked', () => {
    render(<Navbar {...defaultProps} />, { wrapper });
    const logoutButtons = screen.getAllByLabelText(/Cerrar sesión/i);
    fireEvent.click(logoutButtons[0]);
    expect(defaultProps.onLogout).toHaveBeenCalled();
  });

  it('has correct ARIA landmarks', () => {
    render(<Navbar {...defaultProps} />, { wrapper });
    expect(screen.getByRole('navigation', { name: /Navegación principal/i })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: /Menú lateral/i })).toBeInTheDocument();
  });

  it('marks active tab with aria-current', () => {
    render(<Navbar {...defaultProps} />, { wrapper });
    const currentPages = document.querySelectorAll('[aria-current="page"]');
    expect(currentPages.length).toBeGreaterThan(0);
    currentPages.forEach((el) => {
      expect(el).toHaveTextContent('Guardarropa');
    });
  });
});
