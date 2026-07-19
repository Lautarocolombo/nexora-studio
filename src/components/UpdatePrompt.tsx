import { useState, useEffect, useRef } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePWA } from '../hooks/usePWA';

export function UpdatePrompt() {
  const { t } = useTranslation();
  const { needRefresh, reload } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const prevRefreshRef = useRef(needRefresh);

  useEffect(() => {
    if (needRefresh && !prevRefreshRef.current) {
      setDismissed(false);
    }
    prevRefreshRef.current = needRefresh;
  }, [needRefresh]);

  if (!needRefresh || dismissed) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
      <div className="fabric-grain bg-[#1B1814] border border-[#C76B3F]/40 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-3 max-w-sm">
        <div className="p-2 bg-[#C76B3F]/15 rounded-lg">
          <RefreshCw className="w-4 h-4 text-[#C76B3F]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm font-medium text-[#F7F3EC]">{t('update.title')}</p>
          <p className="font-mono text-xs text-[#A89B8C]">{t('update.description')}</p>
        </div>
        <button
          onClick={reload}
          className="animate-press px-3 py-1.5 bg-[#C76B3F] text-[#0B0A08] rounded-lg font-mono text-xs font-bold hover:bg-[#b36138] transition-colors whitespace-nowrap"
        >
          {t('update.update')}
        </button>
        <button
          onClick={() => setDismissed(true)}
          aria-label={t('update.dismiss')}
          className="p-1 text-[#A89B8C] hover:text-[#F7F3EC] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
