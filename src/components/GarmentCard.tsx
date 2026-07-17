import React from 'react';
import { Plus, Heart, Eye } from 'lucide-react';
import { GarmentItem, Language } from '../types';

interface GarmentCardProps {
  garment: GarmentItem;
  language: Language;
  onCardClick: (garment: GarmentItem) => void;
  onLogWear: (e: React.MouseEvent, garment: GarmentItem) => void;
  onToggleFavorite: (e: React.MouseEvent, garmentId: string) => void;
  isSelectableForBuilder?: boolean;
  isSelectedForBuilder?: boolean;
  onSelectForBuilder?: (garment: GarmentItem) => void;
}

export const GarmentCard: React.FC<GarmentCardProps> = ({
  garment,
  language,
  onCardClick,
  onLogWear,
  onToggleFavorite,
  isSelectableForBuilder,
  isSelectedForBuilder,
  onSelectForBuilder
}) => {
  const name = language === 'es' && garment.nameEs ? garment.nameEs : garment.name;
  const wornText = language === 'es'
    ? `Usado ${garment.wornCount} ${garment.wornCount === 1 ? 'vez' : 'veces'}`
    : `Worn ${garment.wornCount} times`;

  const handleClick = () => {
    if (isSelectableForBuilder && onSelectForBuilder) {
      onSelectForBuilder(garment);
    } else {
      onCardClick(garment);
    }
  };

  return (
    <article
      onClick={handleClick}
      className={`fabric-grain bg-[#1B1814] border rounded-2xl overflow-hidden shadow-fabric shadow-fabric-hover transition-all duration-300 group cursor-pointer flex flex-col h-full relative ${
        isSelectedForBuilder
          ? 'ring-2 ring-[#C76B3F] border-[#C76B3F] shadow-lg scale-[1.02]'
          : 'border-[#2A2622] hover:border-[#C76B3F]/60'
      }`}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0E0C0A]">
        <img
          src={garment.imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute top-3 right-3 bg-[#0E0C0A]/85 backdrop-blur-sm px-2 py-1 border border-[#2A2622] rounded">
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#C76B3F]">
            {garment.categoryTag}
          </span>
        </div>

        <button
          onClick={(e) => onToggleFavorite(e, garment.id)}
          className={`absolute top-3 left-3 p-1.5 rounded-full backdrop-blur-sm transition-all z-10 ${
            garment.favorite
              ? 'bg-[#0E0C0A]/80 text-[#C76B3F] shadow-sm'
              : 'bg-[#0E0C0A]/60 text-[#A89B8C] opacity-0 group-hover:opacity-100 hover:bg-[#0E0C0A]'
          }`}
          title={language === 'es' ? 'Favorito' : 'Favorite'}
        >
          <Heart className={`w-3.5 h-3.5 ${garment.favorite ? 'fill-[#C76B3F]' : ''}`} />
        </button>

        {isSelectedForBuilder && (
          <div className="absolute inset-0 bg-[#C76B3F]/20 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="bg-[#C76B3F] text-[#0B0A08] px-3 py-1.5 rounded-full font-mono text-xs font-bold shadow-md flex items-center gap-1.5 animate-pulse">
              <span>{language === 'es' ? '✓ SELECCIONADO' : '✓ SELECTED'}</span>
            </div>
          </div>
        )}

        {!isSelectableForBuilder && (
          <div className="absolute bottom-3 right-3 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLogWear(e, garment);
              }}
              className="bg-[#C76B3F] hover:bg-[#b36138] text-[#0B0A08] px-2.5 py-1 rounded shadow-md font-mono text-[11px] font-semibold flex items-center gap-1 transition-transform active:scale-95"
              title={language === 'es' ? 'Registrar uso hoy (+1)' : 'Log wear today (+1)'}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+1</span>
            </button>
          </div>
        )}
      </div>

        <div className="p-4 flex flex-col gap-1 flex-1 justify-between bg-[#1B1814] z-20">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-sans text-base font-medium text-[#F7F3EC] truncate" title={name}>
              {name}
            </h3>
            {garment.colorSwatch && (
              <span
                className="w-3.5 h-3.5 rounded-full border border-[#2A2622] flex-shrink-0 mt-1 shadow-sm"
                style={{ backgroundColor: garment.colorSwatch }}
                title="Color swatch"
              />
            )}
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#2A2622]">
            <p className="font-mono text-xs text-[#A89B8C] font-medium">
              {wornText}
            </p>
            <span className="font-mono text-[11px] text-[#A89B8C]">
              {garment.season === 'all-year' ? (language === 'es' ? 'Todo el año' : 'All year') : garment.season === 'spring-summer' ? (language === 'es' ? 'Primavera/Ver' : 'Spring/Summer') : (language === 'es' ? 'Otoño/Inv' : 'Autumn/Winter')}
            </span>
          </div>
        </div>
    </article>
  );
};