import React, { useState } from 'react';
import { X, Plus, Trash2, Edit3, Heart, DollarSign, Calendar, Tag, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { GarmentItem, Language } from '../types';

interface GarmentDetailModalProps {
  garment: GarmentItem | null;
  language: Language;
  onClose: () => void;
  onLogWear: (garment: GarmentItem) => void;
  onDelete: (garmentId: string) => void;
  onUpdateNotes: (garmentId: string, newNotes: string) => void;
  onToggleFavorite: (garmentId: string) => void;
}

export const GarmentDetailModal: React.FC<GarmentDetailModalProps> = ({
  garment,
  language,
  onClose,
  onLogWear,
  onDelete,
  onUpdateNotes,
  onToggleFavorite
}) => {
  if (!garment) return null;

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(
    language === 'es' && garment.notesEs ? garment.notesEs : garment.notes || ''
  );

  const name = language === 'es' && garment.nameEs ? garment.nameEs : garment.name;
  const care = language === 'es' && garment.careInstructionsEs ? garment.careInstructionsEs : garment.careInstructions;
  const notes = language === 'es' && garment.notesEs ? garment.notesEs : garment.notes;

  const costPerWear = garment.price 
    ? (garment.price / Math.max(1, garment.wornCount)).toFixed(2)
    : null;

  const handleSaveNotes = () => {
    onUpdateNotes(garment.id, notesText);
    setIsEditingNotes(false);
  };

  const t = {
    wornTimes: language === 'es' ? 'Veces Usado' : 'Times Worn',
    costPerWear: language === 'es' ? 'Costo por Uso' : 'Cost per Wear',
    material: language === 'es' ? 'Composición / Material' : 'Material & Fabric',
    care: language === 'es' ? 'Instrucciones de Cuidado' : 'Care Instructions',
    notes: language === 'es' ? 'Notas de Sastrería' : 'Tailor & Mindful Notes',
    logWear: language === 'es' ? 'Registrar Uso Hoy (+1)' : 'Log Wear Today (+1)',
    delete: language === 'es' ? 'Eliminar del Guardarropa' : 'Remove from Wardrobe',
    edit: language === 'es' ? 'Editar Notas' : 'Edit Notes',
    save: language === 'es' ? 'Guardar' : 'Save',
    brand: language === 'es' ? 'Marca / Atelier' : 'Brand / Atelier',
    season: language === 'es' ? 'Temporada' : 'Season',
    lastWorn: language === 'es' ? 'Último Uso' : 'Last Worn'
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1b1c1b]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="fabric-grain bg-[#ffffff] w-full max-w-3xl rounded-xl border border-[#c4c6cc] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image Panel */}
        <div className="md:w-1/2 relative bg-[#efedec] min-h-[300px] md:min-h-full flex items-center justify-center">
          <img 
            src={garment.imageUrl} 
            alt={name}
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="font-mono text-xs font-bold bg-[#ffffff] text-[#455565] px-2.5 py-1 rounded border border-[#c4c6cc] shadow-sm">
              {garment.categoryTag}
            </span>
          </div>
          <button
            onClick={() => onToggleFavorite(garment.id)}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm shadow-md transition-all ${
              garment.favorite 
                ? 'bg-[#ffffff] text-[#ba1a1a]' 
                : 'bg-[#ffffff]/80 text-[#43474c] hover:bg-[#ffffff]'
            }`}
          >
            <Heart className={`w-5 h-5 ${garment.favorite ? 'fill-[#ba1a1a]' : ''}`} />
          </button>
        </div>

        {/* Right: Details Panel */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-none">
          <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs text-[#735c00] font-semibold tracking-wider uppercase">
                  {garment.brand || 'Mindful Wardrobe'}
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#1b1c1b] mt-0.5">{name}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-1 text-[#43474c] hover:text-[#1b1c1b] rounded-lg hover:bg-[#efedec] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mindful Stats Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#f5f3f1] rounded-lg border border-[#e4e2e0]">
              <div className="flex flex-col">
                <span className="font-mono text-[11px] text-[#43474c] uppercase">{t.wornTimes}</span>
                <span className="font-serif text-xl font-bold text-[#455565]">{garment.wornCount}</span>
              </div>
              <div className="flex flex-col border-l border-[#c4c6cc] pl-3">
                <span className="font-mono text-[11px] text-[#43474c] uppercase">{t.costPerWear}</span>
                <span className="font-serif text-xl font-bold text-[#735c00]">
                  {costPerWear ? `$${costPerWear}` : 'N/A'}
                </span>
              </div>
              {garment.price && (
                <div className="col-span-2 border-t border-[#e4e2e0] pt-2 flex justify-between items-center font-mono text-xs text-[#43474c]">
                  <span>{language === 'es' ? 'Precio de inversión:' : 'Investment price:'}</span>
                  <span className="font-bold text-[#1b1c1b]">${garment.price}</span>
                </div>
              )}
            </div>

            {/* Material & Fabric */}
            {garment.material && (
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs text-[#43474c] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#455565]" />
                  {t.material}
                </span>
                <p className="font-sans text-sm text-[#1b1c1b] pl-5 border-l-2 border-[#455565]/40 py-0.5">
                  {garment.material}
                </p>
              </div>
            )}

            {/* Care Instructions */}
            {care && (
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs text-[#43474c] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#735c00]" />
                  {t.care}
                </span>
                <p className="font-sans text-xs text-[#43474c] pl-5 border-l-2 border-[#735c00]/40 py-0.5 italic">
                  {care}
                </p>
              </div>
            )}

            {/* Notes Section */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-[#43474c] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#455565]" />
                  {t.notes}
                </span>
                {!isEditingNotes ? (
                  <button 
                    onClick={() => setIsEditingNotes(true)}
                    className="font-mono text-[11px] text-[#455565] hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{t.edit}</span>
                  </button>
                ) : (
                  <button 
                    onClick={handleSaveNotes}
                    className="font-mono text-[11px] text-[#735c00] font-bold hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>{t.save}</span>
                  </button>
                )}
              </div>
              
              {!isEditingNotes ? (
                <p className="font-sans text-sm text-[#43474c] bg-[#fbf9f7] p-3 rounded border border-[#e4e2e0]">
                  {notes || (language === 'es' ? 'Sin notas registradas.' : 'No notes recorded yet.')}
                </p>
              ) : (
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="w-full bg-[#fbf9f7] border border-[#455565] rounded p-2.5 font-sans text-sm text-[#1b1c1b] focus:outline-none focus:ring-1 focus:ring-[#455565]"
                  rows={3}
                  placeholder="e.g., Softens after washing, pairs great with denim..."
                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-[#e4e2e0]">
            <button
              onClick={() => {
                onLogWear(garment);
              }}
              className="w-full bg-[#455565] text-white font-sans text-sm py-3 px-4 rounded-lg font-semibold shadow hover:bg-[#394858] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t.logWear}</span>
            </button>

            <div className="flex justify-between items-center pt-2">
              <span className="font-mono text-[11px] text-[#74777c]">
                {t.lastWorn}: {garment.lastWorn || 'N/A'}
              </span>
              <button
                onClick={() => {
                  if (confirm(language === 'es' ? '¿Deseas eliminar esta prenda?' : 'Remove this garment from your wardrobe?')) {
                    onDelete(garment.id);
                    onClose();
                  }
                }}
                className="font-mono text-xs text-[#ba1a1a] hover:text-[#93000a] flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.delete}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
