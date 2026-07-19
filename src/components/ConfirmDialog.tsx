import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAccessibleModal } from '../hooks/useAccessibleModal';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = 'danger',
}) => {
  const { t } = useTranslation();
  const resolvedConfirmLabel = confirmLabel ?? t('common.confirm');
  const resolvedCancelLabel = cancelLabel ?? t('common.cancel');
  const { modalRef, closeOnBackdrop } = useAccessibleModal({
    isOpen,
    onClose: onCancel,
  });

  if (!isOpen) return null;

  const variantClasses = {
    danger: 'text-[#E0795A] border-[#E0795A]/30',
    warning: 'text-[#C76B3F] border-[#C76B3F]/30',
    info: 'text-[#F7F3EC] border-[#2A2622]',
  };

  const confirmVariantClasses = {
    danger: 'bg-[#E0795A] hover:bg-[#c96a4b] text-white',
    warning: 'bg-[#C76B3F] hover:bg-[#A85A32] text-white',
    info: 'bg-[#C76B3F] hover:bg-[#A85A32] text-white',
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-[#0E0C0A]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-modal-backdrop-in"
      onClick={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        ref={modalRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        className="animate-modal-content-in fabric-grain bg-[#1B1814] w-full max-w-sm rounded-xl border border-[#2A2622] shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className={`p-2 rounded-lg border ${variantClasses[variant]} bg-[#161210]`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 id="confirm-title" className="font-display text-lg font-bold text-[#F7F3EC]">
              {title}
            </h3>
            <p id="confirm-message" className="font-sans text-sm text-[#A89B8C] mt-1">
              {message}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2622]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-[#2A2622] rounded-lg font-mono text-xs font-semibold text-[#A89B8C] hover:bg-[#161210] transition-colors"
          >
            {resolvedCancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-lg font-sans text-sm font-semibold shadow transition-all active:scale-[0.98] ${confirmVariantClasses[variant]}`}
          >
            {resolvedConfirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
