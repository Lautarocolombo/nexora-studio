import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from '../i18n';
import { AuditView } from './AuditView';

describe('AuditView', () => {
  beforeEach(() => {
    i18n.changeLanguage('en');
  });

  it('renders the audit title', () => {
    render(<AuditView />);
    expect(screen.getByText('Audit Panel')).toBeDefined();
  });

  it('renders the general progress heading', () => {
    render(<AuditView />);
    expect(screen.getByText('General Progress')).toBeDefined();
  });

  it('renders module sections', () => {
    render(<AuditView />);
    expect(screen.getAllByText('Accessibility').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Security').length).toBeGreaterThanOrEqual(1);
  });

  it('renders KPI labels', () => {
    render(<AuditView />);
    expect(screen.getAllByText('Frontend').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Backend').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('SEO').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the note section', () => {
    render(<AuditView />);
    expect(screen.getByText(/single source of truth/)).toBeDefined();
  });

  it('renders in Spanish when language is es', () => {
    i18n.changeLanguage('es');
    render(<AuditView />);
    expect(screen.getByText('Panel de Auditoría')).toBeDefined();
    expect(screen.getByText('Progreso General')).toBeDefined();
  });
});
