import { useState, useEffect, useRef, useCallback } from 'react';

interface OnboardingStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const STEPS: OnboardingStep[] = [
  {
    target: '[data-onboarding="nav-wardrobe"]',
    title: 'Tu guardarropa',
    description: 'Explorá todas tus prendas, buscá por nombre o filtrá por categoría y temporada.',
    position: 'right',
  },
  {
    target: '[data-onboarding="nav-builder"]',
    title: 'Constructor de conjuntos',
    description: 'Combiná piezas y medí la armonía del outfit antes de guardarlo.',
    position: 'right',
  },
  {
    target: '[data-onboarding="add-garment"]',
    title: 'Agregá prendas',
    description: 'Sumá nuevas piezas con foto, material, temporada y notas de estilo.',
    position: 'left',
  },
];

export function useOnboarding() {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [seen, setSeen] = useState(() => {
    try {
      return sessionStorage.getItem('outfitmatic_onboarding_seen') === 'true';
    } catch {
      return true;
    }
  });
  const highlightRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => {
    setStepIndex(i => Math.min(i + 1, STEPS.length - 1));
  }, []);

  const prev = useCallback(() => {
    setStepIndex(i => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    if (!active || stepIndex >= STEPS.length) return;
    const el = document.querySelector<HTMLElement>(STEPS[stepIndex].target);
    const highlight = highlightRef.current;
    if (!el || !highlight) return;
    const rect = el.getBoundingClientRect();
    const padding = 6;
    Object.assign(highlight.style, {
      position: 'fixed',
      top: `${rect.top - padding}px`,
      left: `${rect.left - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`,
      borderRadius: '12px',
      border: '2px solid #C76B3F',
      boxShadow: '0 0 0 999px rgba(14, 12, 10, 0.65)',
      zIndex: '90',
      pointerEvents: 'none',
      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    });
    highlight.style.display = 'block';
  }, [active, stepIndex]);

  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActive(false);
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        next();
      } else if (e.key === 'ArrowLeft') {
        prev();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, stepIndex, next, prev]);

  const finish = () => {
    setActive(false);
    setSeen(true);
    try {
      sessionStorage.setItem('outfitmatic_onboarding_seen', 'true');
    } catch {
      // ignore storage errors
    }
  };

  const start = () => {
    setStepIndex(0);
    setActive(true);
  };

  const current = STEPS[stepIndex];

  return {
    active,
    stepIndex,
    totalSteps: STEPS.length,
    seen,
    highlightRef,
    currentStep: current,
    tooltipRef,
    next,
    prev,
    finish,
    start,
  };
}
