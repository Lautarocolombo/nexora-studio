import { useState, useEffect, useRef } from 'react';

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
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || stepIndex >= STEPS.length) return;
    const selector = STEPS[stepIndex].target;
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const padding = 6;
    setHighlightStyle({
      position: 'fixed',
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
      borderRadius: '12px',
      border: '2px solid #C76B3F',
      boxShadow: '0 0 0 999px rgba(14, 12, 10, 0.65)',
      zIndex: 90,
      pointerEvents: 'none',
      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    });
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
  }, [active, stepIndex]);

  const next = () => {
    setStepIndex(i => Math.min(i + 1, STEPS.length - 1));
  };

  const prev = () => {
    setStepIndex(i => Math.max(i - 1, 0));
  };

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
    highlightStyle,
    currentStep: current,
    tooltipRef,
    next,
    prev,
    finish,
    start,
  };
}
