import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GarmentItem, GarmentCategory, SeasonTag, Language } from '../../types';
import { CATEGORIES, SEASONS, getCategoryTag } from './AdminConstants';

interface AdminAddFormProps {
  language: Language;
  onAddGarment: (data: Omit<GarmentItem, 'id'>) => void;
  onClose: () => void;
}

const EMPTY_FORM = {
  name: '', nameEs: '', category: 'tops' as Exclude<GarmentCategory, 'all'>,
  categoryTag: '[TOP]', imageUrl: '', wornCount: 0, season: 'all-year' as SeasonTag,
  material: '', notes: '', notesEs: '', colorSwatch: '#455565', favorite: false,
};

export const AdminAddForm: React.FC<AdminAddFormProps> = ({ language: _language, onAddGarment, onClose }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY_FORM);

  const handleAdd = () => {
    if (!form.name.trim() || !form.imageUrl.trim()) return;
    onAddGarment({
      ...form,
      name: form.name.trim(),
      nameEs: form.nameEs?.trim() || form.name.trim(),
      imageUrl: form.imageUrl.trim(),
      material: form.material?.trim() || undefined,
      notes: form.notes?.trim() || undefined,
      notesEs: form.notesEs?.trim() || undefined,
      colorSwatch: form.colorSwatch || undefined,
      categoryTag: form.categoryTag || '[ITEM]',
    });
    setForm(EMPTY_FORM);
    onClose();
  };

  return (
    <div className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-6 shadow-2xl space-y-4">
      <h3 className="font-display text-xl font-bold text-[#F7F3EC]">{t('admin.addNew')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t('admin.name')} *</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none" />
        </div>
        <div>
          <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t('admin.nameEs')}</label>
          <input type="text" value={form.nameEs} onChange={(e) => setForm({ ...form, nameEs: e.target.value })}
            className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none" />
        </div>
        <div>
          <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t('admin.category')}</label>
          <select value={form.category} onChange={(e) => {
              const cat = e.target.value as Exclude<GarmentCategory, 'all'>;
              setForm({ ...form, category: cat, categoryTag: getCategoryTag(cat) });
            }}
            className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none">
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{t(c.i18nKey)}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t('admin.season')}</label>
          <select value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value as SeasonTag })}
            className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none">
            {SEASONS.map(s => <option key={s.value} value={s.value}>{t(s.i18nKey)}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t('admin.imageUrl')} *</label>
          <input type="text" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none" />
        </div>
        <div>
          <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t('admin.material')}</label>
          <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}
            className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none" />
        </div>
        <div>
          <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t('admin.colorSwatch')}</label>
          <div className="flex items-center gap-2">
            <input type="color" value={form.colorSwatch} onChange={(e) => setForm({ ...form, colorSwatch: e.target.value })}
              className="w-10 h-9 rounded border border-[#2A2622] cursor-pointer bg-transparent" />
            <span className="font-mono text-xs text-[#A89B8C]">{form.colorSwatch}</span>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t('admin.notes')}</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
            className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2622]">
        <button onClick={onClose} className="px-4 py-2 border border-[#2A2622] rounded-lg font-mono text-xs font-semibold text-[#A89B8C] hover:bg-[#161210] transition-colors">{t('admin.cancel')}</button>
        <button onClick={handleAdd} className="px-5 py-2 bg-[#C76B3F] text-white rounded-lg font-sans text-sm font-semibold shadow hover:bg-[#A85A32] transition-all flex items-center gap-2">
          <Save className="w-4 h-4" />{t('admin.save')}
        </button>
      </div>
    </div>
  );
};
