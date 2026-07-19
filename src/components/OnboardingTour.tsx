import React from 'react';
import { ChevronRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useOnboarding } from '../hooks/useOnboarding';

export const OnboardingTour: React.FC = () => {
  const { t } = useTranslation();
  const { active, stepIndex, totalSteps, currentStep, highlightRef, tooltipRef, next, prev, finish } = useOnboarding();

  if (!active || !currentStep) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div ref={highlightRef} style={{ display: 'none' }} />
      <div
        ref={tooltipRef}
        className="fixed z-[101] w-80 bg-[#1B1814] border border-[#2A2622] rounded-xl shadow-2xl p-5"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] text-[#C76B3F] font-semibold">
            {t('tour.stepLabel', { current: stepIndex + 1, total: totalSteps })}
          </span>
          <button
            onClick={finish}
            className="text-[#A89B8C] hover:text-[#F7F3EC] transition-colors"
            aria-label={t('tour.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <h3 className="font-display text-lg font-bold text-[#F7F3EC] mb-1">{currentStep.title}</h3>
        <p className="font-sans text-sm text-[#A89B8C] mb-4">{currentStep.description}</p>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={stepIndex === 0}
            className="px-3 py-1.5 border border-[#2A2622] rounded-lg font-mono text-xs font-semibold text-[#A89B8C] hover:bg-[#161210] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('tour.prev')}
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === stepIndex ? 'bg-[#C76B3F] w-4' : 'bg-[#2A2622]'
                }`}
              />
            ))}
          </div>
          {stepIndex < totalSteps - 1 ? (
            <button
              type="button"
              onClick={next}
              className="px-3 py-1.5 bg-[#C76B3F] text-white rounded-lg font-sans text-xs font-semibold hover:bg-[#A85A32] transition-colors flex items-center gap-1"
            >
              {t('tour.next')}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="px-3 py-1.5 bg-[#C76B3F] text-white rounded-lg font-sans text-xs font-semibold hover:bg-[#A85A32] transition-colors"
            >
              {t('tour.start')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
