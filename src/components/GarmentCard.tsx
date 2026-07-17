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
      className={`fabric-grain bg-[#ffffff] border rounded-lg overflow-hidden shadow-fabric shadow-fabric-hover transition-all duration-300 group cursor-pointer flex flex-col h-full relative ${
        isSelectedForBuilder 
          ? 'ring-2 ring-[#455565] border-[#455565] shadow-lg scale-[1.02]' 
          : 'border-[#c4c6cc] hover:border-[#455565]'
      }`}
    >
      {/* Image Container with 3:4 Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#efedec]">
        <img 
          src={garment.imageUrl} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
          loading="lazy"
        />
        
        {/* Category Tag Pill [TOP], [BOTTOM], etc. */}
        <div className="absolute top-3 right-3 bg-[#ffffff]/95 backdrop-blur-sm px-2 py-1 border border-[#c4c6cc] rounded shadow-sm z-10">
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#455565]">
            {garment.categoryTag}
          </span>
        </div>

        {/* Favorite Heart Toggle */}
        <button
          onClick={(e) => onToggleFavorite(e, garment.id)}
          className={`absolute top-3 left-3 p-1.5 rounded-full backdrop-blur-sm transition-all z-10 ${
            garment.favorite 
              ? 'bg-[#ffffff]/90 text-[#ba1a1a] shadow-sm' 
              : 'bg-[#ffffff]/60 text-[#43474c] opacity-0 group-hover:opacity-100 hover:bg-[#ffffff]'
          }`}
          title={language === 'es' ? 'Favorito' : 'Favorite'}
        >
          <Heart className={`w-3.5 h-3.5 ${garment.favorite ? 'fill-[#ba1a1a]' : ''}`} />
        </button>

        {/* Builder Selection Check Badge */}
        {isSelectedForBuilder && (
          <div className="absolute inset-0 bg-[#455565]/20 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="bg-[#455565] text-white px-3 py-1.5 rounded-full font-mono text-xs font-bold shadow-md flex items-center gap-1.5 animate-pulse">
              <span>{language === 'es' ? '✓ SELECCIONADO' : '✓ SELECTED'}</span>
            </div>
          </div>
        )}

        {/* Quick Log Wear Overlay Button on Hover */}
        {!isSelectableForBuilder && (
          <div className="absolute bottom-3 right-3 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLogWear(e, garment);
              }}
              className="bg-[#455565] hover:bg-[#394858] text-white px-2.5 py-1 rounded shadow-md font-mono text-[11px] font-semibold flex items-center gap-1 transition-transform active:scale-95"
              title={language === 'es' ? 'Registrar uso hoy (+1)' : 'Log wear today (+1)'}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+1</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Content Footer */}
      <div className="p-4 flex flex-col gap-1 flex-1 justify-between bg-[#ffffff] z-20">
        <div className="flex items-start justify-between gap-1">
          <h3 className="font-sans text-base font-medium text-[#1b1c1b] truncate" title={name}>
            {name}
          </h3>
          {garment.colorSwatch && (
            <span 
              className="w-3.5 h-3.5 rounded-full border border-[#c4c6cc] flex-shrink-0 mt-1 shadow-sm"
              style={{ backgroundColor: garment.colorSwatch }}
              title="Color swatch"
            />
          )}
        </div>
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#f5f3f1]">
          <p className="font-mono text-xs text-[#43474c] font-medium">
            {wornText}
          </p>
          {garment.price && (
            <span className="font-mono text-[11px] text-[#74777c]">
              ${(garment.price / Math.max(1, garment.wornCount)).toFixed(0)}/use
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
