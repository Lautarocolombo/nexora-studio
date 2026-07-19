import React from 'react';
import { Edit3, Trash2, Save, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GarmentItem, GarmentCategory, SeasonTag, Language } from '../../types';
import { ConfirmDialog } from '../ConfirmDialog';
import { CATEGORIES, SEASONS, getCategoryTag } from './AdminConstants';

interface AdminGarmentRowProps {
  garment: GarmentItem;
  isEditing: boolean;
  language: Language;
  onStartEdit: (g: GarmentItem) => void;
  editForm: Partial<GarmentItem>;
  setEditForm: (f: Partial<GarmentItem>) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  onDeleteGarment: (id: string) => void;
}

export const AdminGarmentRow: React.FC<AdminGarmentRowProps> = ({
  garment, isEditing, language, onStartEdit, editForm, setEditForm,
  onSaveEdit, onCancelEdit, deleteId, setDeleteId, onDeleteGarment,
}) => {
  const { t } = useTranslation();
  const displayName = language === 'es' && garment.nameEs ? garment.nameEs : garment.name;

  return (
    <tr className="hover:bg-[#161210] transition-colors">
      <td className="p-3">
        <img src={garment.imageUrl} alt={displayName} className="w-10 h-12 rounded object-cover border border-[#2A2622]" />
      </td>
      <td className="p-3">
        {isEditing ? (
          <input type="text" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            className="w-full bg-[#0E0C0A] border border-[#2A2622] rounded px-2 py-1 text-xs text-[#F7F3EC] focus:border-[#C76B3F] focus:outline-none" />
        ) : (
          <div>
            <p className="font-sans text-sm font-medium text-[#F7F3EC] truncate max-w-[200px]">{displayName}</p>
            <p className="font-mono text-xs text-[#A89B8C]">{garment.categoryTag}</p>
          </div>
        )}
      </td>
      <td className="p-3 hidden md:table-cell">
        {isEditing ? (
          <select value={editForm.category || 'tops'} onChange={(e) => {
              const cat = e.target.value as Exclude<GarmentCategory, 'all'>;
              setEditForm({ ...editForm, category: cat, categoryTag: getCategoryTag(cat) });
            }}
            className="bg-[#0E0C0A] border border-[#2A2622] rounded px-2 py-1 text-xs text-[#F7F3EC] focus:border-[#C76B3F] focus:outline-none">
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{t(c.i18nKey)}</option>)}
          </select>
        ) : (
          <span className="font-mono text-xs text-[#A89B8C]">{garment.category}</span>
        )}
      </td>
      <td className="p-3 hidden lg:table-cell">
        {isEditing ? (
          <select value={editForm.season || 'all-year'} onChange={(e) => setEditForm({ ...editForm, season: e.target.value as SeasonTag })}
            className="bg-[#0E0C0A] border border-[#2A2622] rounded px-2 py-1 text-xs text-[#F7F3EC] focus:border-[#C76B3F] focus:outline-none">
            {SEASONS.map(s => <option key={s.value} value={s.value}>{t(s.i18nKey)}</option>)}
          </select>
        ) : (
          <span className="font-mono text-xs text-[#A89B8C]">{garment.season}</span>
        )}
      </td>
      <td className="p-3 hidden md:table-cell">
        {isEditing ? (
          <input type="text" value={editForm.material || ''} onChange={(e) => setEditForm({ ...editForm, material: e.target.value })}
            className="w-full bg-[#0E0C0A] border border-[#2A2622] rounded px-2 py-1 text-xs text-[#F7F3EC] focus:border-[#C76B3F] focus:outline-none" />
        ) : (
          <span className="font-mono text-xs text-[#A89B8C] truncate block max-w-[120px]">{garment.material || '—'}</span>
        )}
      </td>
      <td className="p-3 text-center">
        {isEditing ? (
          <input type="number" value={editForm.wornCount ?? 0}
            onChange={(e) => setEditForm({ ...editForm, wornCount: parseInt(e.target.value) || 0 })}
            className="w-16 bg-[#0E0C0A] border border-[#2A2622] rounded px-2 py-1 text-xs text-[#F7F3EC] focus:border-[#C76B3F] focus:outline-none text-center" />
        ) : (
          <span className="font-mono text-xs font-bold text-[#C76B3F]">{garment.wornCount}</span>
        )}
      </td>
      <td className="p-3">
        <div className="flex items-center justify-center gap-2">
          {isEditing ? (
            <>
              <button onClick={onSaveEdit} className="p-1.5 text-[#C76B3F] hover:bg-[#1B1814] rounded transition-colors" title={t('admin.save')}>
                <Save className="w-4 h-4" />
              </button>
              <button onClick={onCancelEdit} className="p-1.5 text-[#A89B8C] hover:bg-[#1B1814] rounded transition-colors" title={t('admin.cancel')}>
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onStartEdit(garment)} aria-label={t('admin.edit')}
                className="p-1.5 text-[#A89B8C] hover:text-[#C76B3F] hover:bg-[#1B1814] rounded transition-colors" title={t('admin.edit')}>
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteId(garment.id)} aria-label={t('admin.delete')}
                className="p-1.5 text-[#A89B8C] hover:text-[#E0795A] hover:bg-[#1B1814] rounded transition-colors" title={t('admin.delete')}>
                <Trash2 className="w-4 h-4" />
              </button>
              <ConfirmDialog
                isOpen={deleteId === garment.id}
                title={t('admin.delete')}
                message={t('admin.confirmDelete')}
                onConfirm={() => { onDeleteGarment(garment.id); setDeleteId(null); }}
                onCancel={() => setDeleteId(null)}
                variant="danger"
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
