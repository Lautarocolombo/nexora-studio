import React, { useState, useMemo } from 'react';
import { Search, Plus, Shirt } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GarmentItem, Language } from '../types';
import { AdminAddForm } from './admin/AdminAddForm';
import { AdminGarmentRow } from './admin/AdminGarmentRow';

interface AdminPanelProps {
  garments: GarmentItem[];
  onUpdateGarment: (id: string, data: Partial<GarmentItem>) => void;
  onDeleteGarment: (id: string) => void;
  onAddGarment: (data: Omit<GarmentItem, 'id'>) => void;
  language: Language;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  garments, onUpdateGarment, onDeleteGarment, onAddGarment, language,
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<GarmentItem>>({});

  const filteredGarments = useMemo(() => {
    if (!search.trim()) return garments;
    const q = search.toLowerCase();
    return garments.filter(g =>
      g.name.toLowerCase().includes(q) || g.nameEs?.toLowerCase().includes(q) ||
      g.categoryTag.toLowerCase().includes(q) || g.material?.toLowerCase().includes(q) ||
      g.notes?.toLowerCase().includes(q)
    );
  }, [garments, search]);

  const startEdit = (garment: GarmentItem) => {
    setEditForm({ id: garment.id, name: garment.name, nameEs: garment.nameEs, category: garment.category,
      categoryTag: garment.categoryTag, material: garment.material, notes: garment.notes, notesEs: garment.notesEs,
      season: garment.season, colorSwatch: garment.colorSwatch, imageUrl: garment.imageUrl,
      wornCount: garment.wornCount, favorite: garment.favorite });
    setEditingId(garment.id);
    setShowAddForm(false);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editForm) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = editForm;
    onUpdateGarment(editingId, rest);
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#F7F3EC] tracking-tight">{t('admin.title')}</h2>
          <p className="font-sans text-sm text-[#A89B8C] mt-1">{t('admin.subtitle')}</p>
          <p className="font-mono text-xs text-[#A89B8C] mt-1">{t('admin.totalItems')}: {garments.length}</p>
        </div>
        <button onClick={() => { setShowAddForm(true); setEditingId(null); }}
          className="px-4 py-2 bg-[#C76B3F] hover:bg-[#A85A32] text-white rounded-lg font-sans text-sm font-semibold shadow-md flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" />{t('admin.addNew')}
        </button>
      </header>

      {showAddForm && (
        <AdminAddForm language={language} onAddGarment={onAddGarment} onClose={() => setShowAddForm(false)} />
      )}

      <div className="relative w-full md:w-96">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89B8C]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('admin.search')}
          className="w-full pl-10 pr-4 py-2 bg-[#1B1814] border border-[#2A2622] rounded-lg focus:border-[#C76B3F] focus:outline-none font-sans text-sm text-[#F7F3EC] transition-colors placeholder:text-[#A89B8C]" />
      </div>

      <div className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" aria-label={t('admin.title')}>
            <thead>
              <tr className="bg-[#161210] border-b border-[#2A2622]">
                <th className="p-3 font-mono text-xs text-[#A89B8C] uppercase tracking-wider w-16">{t('admin.img')}</th>
                <th className="p-3 font-mono text-xs text-[#A89B8C] uppercase tracking-wider">{t('admin.name')}</th>
                <th className="p-3 font-mono text-xs text-[#A89B8C] uppercase tracking-wider hidden md:table-cell">{t('admin.category')}</th>
                <th className="p-3 font-mono text-xs text-[#A89B8C] uppercase tracking-wider hidden lg:table-cell">{t('admin.season')}</th>
                <th className="p-3 font-mono text-xs text-[#A89B8C] uppercase tracking-wider hidden md:table-cell">{t('admin.material')}</th>
                <th className="p-3 font-mono text-xs text-[#A89B8C] uppercase tracking-wider w-24 text-center">{t('admin.wornCount')}</th>
                <th className="p-3 font-mono text-xs text-[#A89B8C] uppercase tracking-wider w-32 text-center">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2622]">
              {filteredGarments.map((g) => (
                <AdminGarmentRow
                  key={g.id} garment={g} isEditing={editingId === g.id}
                  language={language} onStartEdit={startEdit}
                  editForm={editForm} setEditForm={setEditForm}
                  onSaveEdit={handleSaveEdit} onCancelEdit={() => { setEditingId(null); setEditForm({}); }}
                  deleteId={deleteId} setDeleteId={setDeleteId} onDeleteGarment={onDeleteGarment}
                />
              ))}
            </tbody>
          </table>
        </div>
        {filteredGarments.length === 0 && (
          <div className="p-12 text-center text-[#A89B8C]">
            <Shirt className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="font-sans text-sm">{t('admin.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
