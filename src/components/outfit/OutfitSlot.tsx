import React from 'react';
import { Shirt } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GarmentItem, Language } from '../../types';

interface OutfitSlotProps {
  label: string;
  tagLabel: string;
  placeholder: string;
  item?: GarmentItem;
  isActive: boolean;
  language: Language;
  onSelect: () => void;
  onRemove: () => void;
}

export const OutfitSlot: React.FC<OutfitSlotProps> = ({
  label,
  tagLabel,
  placeholder,
  item,
  isActive,
  language,
  onSelect,
  onRemove
}) => {
  const { t } = useTranslation();
  const name = item
    ? (language === 'es' && item.nameEs ? item.nameEs : item.name)
    : placeholder;
  const wearText = item
    ? t('outfit.wearText', { count: item.wornCount })
    : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
      className={`w-full text-left p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
        isActive
          ? 'border-[#C76B3F] bg-[#161210] shadow-sm'
          : 'border-dashed border-[#2A2622] hover:border-[#C76B3F]/60'
      }`}
      aria-label={label}
    >
      <div className="flex items-center gap-3.5">
        <div className="w-14 h-16 bg-[#161210] rounded overflow-hidden flex-shrink-0 border border-[#2A2622] flex items-center justify-center">
          {item ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <Shirt className="w-6 h-6 text-[#6B6358]" />
          )}
        </div>
        <div>
          <span className="font-mono text-xs text-[#C76B3F] font-bold">{tagLabel}</span>
          <h4 className="font-sans text-sm font-semibold text-[#F7F3EC] truncate max-w-[180px]">{name}</h4>
          {wearText && <span className="font-mono text-xs text-[#A89B8C]">{wearText}</span>}
        </div>
      </div>
      {item && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          aria-label={t('outfit.removeAria', { label })}
          className="text-[#6B6358] hover:text-[#C76B3F] p-1 text-xs font-mono"
        >
          ✕
        </button>
      )}
    </div>
  );
};
