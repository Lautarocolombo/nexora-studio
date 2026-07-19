import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, ShieldAlert, Sparkles } from 'lucide-react';
import { useOnboarding } from '../hooks/useOnboarding';

export const HelpView: React.FC = () => {
  const { start } = useOnboarding();
  const { t } = useTranslation();

  const fabrics = [
    { name: t('help.fabric1Name'), care: t('help.fabric1Care') },
    { name: t('help.fabric2Name'), care: t('help.fabric2Care') },
    { name: t('help.fabric3Name'), care: t('help.fabric3Care') },
    { name: t('help.fabric4Name'), care: t('help.fabric4Care') }
  ];

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <header>
        <h2 className="font-display text-3xl font-bold text-[#F7F3EC] tracking-tight">{t('help.title')}</h2>
        <p className="font-sans text-sm text-[#A89B8C] mt-1">{t('help.subtitle')}</p>
      </header>

      <section className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-6 shadow-2xl space-y-4">
        <h3 className="font-display text-xl font-bold text-[#F7F3EC] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#C76B3F]" />
          <span>{t('help.philosophyTitle')}</span>
        </h3>
        <p className="font-sans text-base text-[#A89B8C] leading-relaxed">{t('help.philosophyP1')}</p>
      </section>

      <section className="fabric-grain bg-[#161210] border border-[#C76B3F] rounded-xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-[#C76B3F] flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <span>{t('help.cpwTitle')}</span>
          </h3>
          <span className="font-mono text-xs font-bold bg-[#1B1814] text-[#C76B3F] px-2.5 py-1 rounded border border-[#2A2622]">{t('help.wearsEqualsStyle')}</span>
        </div>
        <p className="font-sans text-sm text-[#F7F3EC] leading-relaxed">{t('help.cpwDesc')}</p>
      </section>

      <section className="space-y-6">
        <h3 className="font-display text-2xl font-bold text-[#F7F3EC] flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-[#C76B3F]" />
          <span>{t('help.careTitle')}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fabrics.map((f, idx) => (
            <div key={idx} className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-5 shadow-2xl flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-[#C76B3F] font-bold uppercase tracking-wider block mb-1">[FABRIC SPEC #{idx + 1}]</span>
                <h4 className="font-display text-lg font-bold text-[#F7F3EC] mb-2">{f.name}</h4>
                <p className="font-sans text-xs text-[#A89B8C] leading-relaxed pl-3 border-l-2 border-[#C76B3F]/40 py-0.5">{f.care}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="pt-4">
        <button
          type="button"
          onClick={start}
          className="px-4 py-2 bg-[#161210] hover:bg-[#1B1814] text-[#C76B3F] border border-[#2A2622] rounded-lg font-mono text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          {t('help.restartTour')}
        </button>
      </section>
    </div>
  );
};
