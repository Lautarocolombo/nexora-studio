import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAccessibleModal } from '../../hooks/useAccessibleModal';
import { validateGarmentName, MAX_NAME_LENGTH } from '../../lib/validation';
import { toast } from 'sonner';
interface SaveOutfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, occasion: string) => void;
  pieceCount: number;
}

export const SaveOutfitModal: React.FC<SaveOutfitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  pieceCount
}) => {
  const { t } = useTranslation();
  const [outfitName, setOutfitName] = useState('');
  const [occasion, setOccasion] = useState('');

  const { modalRef, closeOnBackdrop } = useAccessibleModal({
    isOpen,
    onClose,
    initialFocusRef: { current: null },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pieceCount === 0) return;
    const nameError = validateGarmentName(outfitName);
    if (nameError) { toast.error(nameError); return; }
    onSave(outfitName.trim(), occasion.trim() || t('saveOutfitModal.fallbackOccasion'));
    setOutfitName('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0E0C0A]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-modal-backdrop-in"
      onClick={(e) => { if (closeOnBackdrop && e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-outfit-title"
        className="animate-modal-content-in fabric-grain bg-[#1B1814] w-full max-w-md rounded-xl border border-[#2A2622] shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="save-outfit-title" className="font-display text-xl font-bold text-[#F7F3EC] mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#C76B3F]" />
          <span>{t('saveOutfitModal.title')}</span>
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t('saveOutfitModal.nameLabel')}</label>
            <input
              type="text"
              required
              value={outfitName}
              onChange={e => setOutfitName(e.target.value)}
              placeholder={t('saveOutfitModal.namePlaceholder')}
              maxLength={MAX_NAME_LENGTH}
              className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t('saveOutfitModal.occasionLabel')}</label>
            <input
              type="text"
              value={occasion}
              onChange={e => setOccasion(e.target.value)}
              placeholder={t('saveOutfitModal.occasionPlaceholder')}
              className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2622]">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-[#2A2622] rounded-lg font-mono text-xs font-semibold text-[#A89B8C] hover:bg-[#161210] transition-colors">
              {t('saveOutfitModal.cancel')}
            </button>
            <button type="submit" className="px-5 py-2 bg-[#C76B3F] text-white rounded-lg font-sans text-sm font-semibold shadow hover:bg-[#A85A32]">
              {t('saveOutfitModal.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
