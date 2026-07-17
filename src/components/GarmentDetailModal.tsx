import React, { useState } from 'react';
import { X, Plus, Trash2, Edit3, Heart, Calendar, Tag, ShieldAlert, Sparkles, Check } from 'lucide-react';
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

  const handleSaveNotes = () => {
    onUpdateNotes(garment.id, notesText);
    setIsEditingNotes(false);
  };

  const t = {
    wornTimes: language === 'es' ? 'Veces Usado' : 'Times Worn',
    season: language === 'es' ? 'Temporada' : 'Season',
    material: language === 'es' ? 'Composición / Material' : 'Material & Fabric',
    care: language === 'es' ? 'Instrucciones de Cuidado' : 'Care Instructions',
    notes: language === 'es' ? 'Notas' : 'Notes',
    logWear: language === 'es' ? 'Registrar Uso Hoy (+1)' : 'Log Wear Today (+1)',
    delete: language === 'es' ? 'Eliminar' : 'Remove',
    edit: language === 'es' ? 'Editar' : 'Edit',
    save: language === 'es' ? 'Guardar' : 'Save',
    lastWorn: language === 'es' ? 'Último Uso' : 'Last Worn',
    seasonLabel: language === 'es' ? 'Temporada ideal' : 'Best season',
    styleNote: language === 'es' ? 'Nota de estilo' : 'Style note'
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0E0C0A]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="fabric-grain bg-[#1B1814] w-full max-w-3xl rounded-2xl border border-[#2A2622] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="md:w-1/2 relative bg-[#0E0C0A] min-h-[300px] md:min-h-full flex items-center justify-center">
          <img
            src={garment.imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="font-mono text-xs font-bold bg-[#0E0C0A] text-[#C76B3F] px-2.5 py-1 rounded border border-[#2A2622] shadow-sm">
              {garment.categoryTag}
            </span>
          </div>
          <button
            onClick={() => onToggleFavorite(garment.id)}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm shadow-md transition-all ${
              garment.favorite
                ? 'bg-[#0E0C0A] text-[#C76B3F]'
                : 'bg-[#0E0C0A]/80 text-[#A89B8C] hover:bg-[#0E0C0A]'
            }`}
          >
            <Heart className={`w-5 h-5 ${garment.favorite ? 'fill-[#C76B3F]' : ''}`} />
          </button>
        </div>

        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-none">
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-start">
            <div>
              <span className="font-mono text-xs text-[#C76B3F] font-semibold tracking-wider uppercase">
                {garment.categoryTag}
              </span>
              <h2 className="font-display text-2xl font-bold text-[#F7F3EC] mt-0.5">{name}</h2>
            </div>
              <button
                onClick={onClose}
                className="p-1 text-[#A89B8C] hover:text-[#F7F3EC] rounded-lg hover:bg-[#161210] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#161210] rounded-lg border border-[#2A2622]">
              <div className="flex flex-col">
                <span className="font-mono text-[11px] text-[#A89B8C] uppercase">{t.wornTimes}</span>
                <span className="font-display text-xl font-bold text-[#F7F3EC]">{garment.wornCount}</span>
              </div>
              <div className="flex flex-col border-l border-[#2A2622] pl-3">
                <span className="font-mono text-[11px] text-[#A89B8C] uppercase">{t.seasonLabel}</span>
                <span className="font-display text-xl font-bold text-[#C76B3F]">
                  {garment.season === 'all-year' ? (language === 'es' ? 'Todo el año' : 'All year') : garment.season === 'spring-summer' ? (language === 'es' ? 'Primavera/Ver' : 'Spring/Summer') : (language === 'es' ? 'Otoño/Inv' : 'Autumn/Winter')}
                </span>
              </div>
            </div>

            {garment.material && (
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs text-[#A89B8C] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#C76B3F]" />
                  {t.material}
                </span>
                <p className="font-sans text-sm text-[#F7F3EC] pl-5 border-l-2 border-[#C76B3F]/40 py-0.5">
                  {garment.material}
                </p>
              </div>
            )}

            {care && (
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs text-[#A89B8C] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#C76B3F]" />
                  {t.care}
                </span>
                <p className="font-sans text-xs text-[#A89B8C] pl-5 border-l-2 border-[#C76B3F]/40 py-0.5 italic">
                  {care}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-[#A89B8C] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C76B3F]" />
                  {t.notes}
                </span>
                {!isEditingNotes ? (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="font-mono text-[11px] text-[#C76B3F] hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{t.edit}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveNotes}
                    className="font-mono text-[11px] text-[#C76B3F] font-bold hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>{t.save}</span>
                  </button>
                )}
              </div>

              {!isEditingNotes ? (
                <p className="font-sans text-sm text-[#A89B8C] bg-[#161210] p-3 rounded border border-[#2A2622]">
                  {notes || (language === 'es' ? 'Sin notas.' : 'No notes recorded yet.')}
                </p>
              ) : (
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="w-full bg-[#161210] border border-[#C76B3F] rounded p-2.5 font-sans text-sm text-[#F7F3EC] focus:outline-none focus:ring-1 focus:ring-[#C76B3F]"
                  rows={3}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-[#2A2622]">
            <button
              onClick={() => { onLogWear(garment); }}
              className="w-full bg-[#C76B3F] text-[#0B0A08] font-sans text-sm py-3 px-4 rounded-lg font-semibold shadow hover:bg-[#b36138] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t.logWear}</span>
            </button>

            <div className="flex justify-between items-center pt-2">
              <span className="font-mono text-[11px] text-[#A89B8C]">
                {t.lastWorn}: {garment.lastWorn || 'N/A'}
              </span>
              <button
                onClick={() => {
                  if (confirm(language === 'es' ? '¿Deseas eliminar esta prenda?' : 'Remove this garment?')) {
                    onDelete(garment.id);
                    onClose();
                  }
                }}
                className="font-mono text-xs text-[#E0795A] hover:text-[#C76B3F] flex items-center gap-1 transition-colors"
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