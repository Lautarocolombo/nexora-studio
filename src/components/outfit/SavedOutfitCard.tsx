import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GarmentItem, SavedOutfit, Language } from '../../types';

interface SavedOutfitCardProps {
  outfit: SavedOutfit;
  language: Language;
  garmentIndex: Map<string, GarmentItem>;
  onLogWear: (outfit: SavedOutfit) => void;
  onDelete: (id: string) => void;
}

export const SavedOutfitCard: React.FC<SavedOutfitCardProps> = ({
  outfit,
  language,
  garmentIndex,
  onLogWear,
  onDelete
}) => {
  const { t } = useTranslation();
  const name = language === 'es' && outfit.nameEs ? outfit.nameEs : outfit.name;
  const occ = language === 'es' && outfit.occasionEs ? outfit.occasionEs : outfit.occasion;

  return (
    <div className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-5 shadow-2xl hover:shadow-[#C76B3F]/10 transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="font-mono text-xs text-[#C76B3F] font-semibold tracking-wider uppercase">{occ}</span>
            <h4 className="font-display text-lg font-bold text-[#F7F3EC] mt-0.5">{name}</h4>
          </div>
          <span className="font-mono text-xs font-bold bg-[#1B1814] text-[#C76B3F] px-2 py-0.5 rounded border border-[#2A2622]">
            {outfit.harmonyScore || 95}% Harm.
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 my-4 bg-[#161210] p-2 rounded-lg border border-[#2A2622]">
          {outfit.garmentIds.map((id, idx) => {
            const item = garmentIndex.get(id);
            if (!item) return null;
            return (
              <div key={idx} className="aspect-square bg-[#0E0C0A] rounded overflow-hidden border border-[#2A2622]" title={item.name}>
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-[#2A2622] flex justify-between items-center mt-auto">
        <span className="font-mono text-xs text-[#A89B8C]">
          {t('outfit.wornCount', { count: outfit.wornCount })}
        </span>

        <div className="flex gap-2">
          <button onClick={() => onLogWear(outfit)} aria-label={t('outfit.wornToday')} className="bg-[#C76B3F] hover:bg-[#A85A32] text-white px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1 shadow-sm transition-transform active:scale-95">
            <Plus className="w-3.5 h-3.5" />
            <span>{t('outfit.wornToday')}</span>
          </button>

          <button onClick={() => onDelete(outfit.id)} aria-label={t('outfit.deleteAria')} className="p-1.5 text-[#6B6358] hover:text-[#C76B3F] transition-colors rounded hover:bg-[#1B1814]">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
