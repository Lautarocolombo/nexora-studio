import React, { useState, useMemo } from 'react';
import { Search, Edit3, Trash2, X, Save, Plus, Shirt } from 'lucide-react';
import { GarmentItem, GarmentCategory, SeasonTag, Language } from '../types';
import { ConfirmDialog } from './ConfirmDialog';

interface AdminPanelProps {
  garments: GarmentItem[];
  onUpdateGarment: (id: string, data: Partial<GarmentItem>) => void;
  onDeleteGarment: (id: string) => void;
  onAddGarment: (data: Omit<GarmentItem, 'id'>) => void;
  language: Language;
}

const CATEGORIES: { value: Exclude<GarmentCategory, 'all'>; labelEs: string; labelEn: string }[] = [
  { value: 'tops', labelEs: 'Tops', labelEn: 'Tops' },
  { value: 'bottoms', labelEs: 'Pantalones', labelEn: 'Bottoms' },
  { value: 'shoes', labelEs: 'Calzado', labelEn: 'Shoes' },
  { value: 'outerwear', labelEs: 'Abrigos', labelEn: 'Outerwear' },
  { value: 'accessories', labelEs: 'Accesorios', labelEn: 'Accessories' },
  { value: 'dresses', labelEs: 'Vestidos', labelEn: 'Dresses' },
  { value: 'formal', labelEs: 'Formal', labelEn: 'Formal' },
];

const SEASONS: { value: SeasonTag; labelEs: string; labelEn: string }[] = [
  { value: 'all-year', labelEs: 'Todo el año', labelEn: 'All Year' },
  { value: 'spring-summer', labelEs: 'Primavera / Verano', labelEn: 'Spring / Summer' },
  { value: 'autumn-winter', labelEs: 'Otoño / Invierno', labelEn: 'Autumn / Winter' },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  garments,
  onUpdateGarment,
  onDeleteGarment,
  onAddGarment,
  language
}) => {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<GarmentItem>>({});
  const [addForm, setAddForm] = useState<Omit<GarmentItem, 'id'>>({
    name: '',
    nameEs: '',
    category: 'tops',
    categoryTag: '[TOP]',
    imageUrl: '',
    wornCount: 0,
    season: 'all-year',
    material: '',
    notes: '',
    notesEs: '',
    colorSwatch: '#455565',
    favorite: false,
  });

  const t = {
    title: language === 'es' ? 'Panel de Administración' : 'Admin Panel',
    subtitle: language === 'es' ? 'Gestioná prendas, modificá datos y organizá tu armario.' : 'Manage garments, edit data, and organize your wardrobe.',
    search: language === 'es' ? 'Buscar prenda...' : 'Search garment...',
    actions: language === 'es' ? 'Acciones' : 'Actions',
    edit: language === 'es' ? 'Editar' : 'Edit',
    delete: language === 'es' ? 'Eliminar' : 'Delete',
    save: language === 'es' ? 'Guardar' : 'Save',
    cancel: language === 'es' ? 'Cancelar' : 'Cancel',
    addNew: language === 'es' ? 'Nueva Prenda' : 'New Garment',
    name: language === 'es' ? 'Nombre' : 'Name',
    nameEs: language === 'es' ? 'Nombre (ES)' : 'Name (ES)',
    category: language === 'es' ? 'Categoría' : 'Category',
    season: language === 'es' ? 'Temporada' : 'Season',
    material: language === 'es' ? 'Material' : 'Material',
    notes: language === 'es' ? 'Notas' : 'Notes',
    colorSwatch: language === 'es' ? 'Color' : 'Color',
    imageUrl: language === 'es' ? 'URL Imagen' : 'Image URL',
    wornCount: language === 'es' ? 'Veces usada' : 'Times worn',
    confirmDelete: language === 'es' ? '¿Eliminar esta prenda permanentemente?' : 'Delete this garment permanently?',
    totalItems: language === 'es' ? 'Total prendas' : 'Total garments',
  };

  const filteredGarments = useMemo(() => {
    return garments.filter(g => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.nameEs?.toLowerCase().includes(q) ||
        g.categoryTag.toLowerCase().includes(q) ||
        g.material?.toLowerCase().includes(q) ||
        g.notes?.toLowerCase().includes(q)
      );
    });
  }, [garments, search]);

  const startEdit = (garment: GarmentItem) => {
    setEditForm({
      id: garment.id,
      name: garment.name,
      nameEs: garment.nameEs,
      category: garment.category,
      categoryTag: garment.categoryTag,
      material: garment.material,
      notes: garment.notes,
      notesEs: garment.notesEs,
      season: garment.season,
      colorSwatch: garment.colorSwatch,
      imageUrl: garment.imageUrl,
      wornCount: garment.wornCount,
      favorite: garment.favorite,
    });
    setEditingId(garment.id);
    setShowAddForm(false);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editForm) return;
    const { id, ...rest } = editForm;
    onUpdateGarment(id, rest);
    setEditingId(null);
    setEditForm({});
  };

  const handleAdd = () => {
    if (!addForm.name.trim() || !addForm.imageUrl.trim()) return;
    onAddGarment({
      ...addForm,
      name: addForm.name.trim(),
      nameEs: addForm.nameEs?.trim() || addForm.name.trim(),
      imageUrl: addForm.imageUrl.trim(),
      material: addForm.material?.trim() || undefined,
      notes: addForm.notes?.trim() || undefined,
      notesEs: addForm.notesEs?.trim() || undefined,
      colorSwatch: addForm.colorSwatch || undefined,
      categoryTag: addForm.categoryTag || '[ITEM]',
    });
    setAddForm({
      name: '',
      nameEs: '',
      category: 'tops',
      categoryTag: '[TOP]',
      imageUrl: '',
      wornCount: 0,
      season: 'all-year',
      material: '',
      notes: '',
      notesEs: '',
      colorSwatch: '#455565',
      favorite: false,
    });
    setShowAddForm(false);
  };

  const getCategoryTag = (cat: GarmentItem['category']) => {
    const map: Record<string, string> = {
      tops: '[TOP]',
      bottoms: '[BOTTOM]',
      shoes: '[SHOES]',
      outerwear: '[OUTERWEAR]',
      accessories: '[ACCESSORY]',
      dresses: '[DRESS]',
      formal: '[FORMAL]',
    };
    return map[cat] || '[ITEM]';
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#F7F3EC] tracking-tight">{t.title}</h2>
          <p className="font-sans text-sm text-[#A89B8C] mt-1">{t.subtitle}</p>
          <p className="font-mono text-xs text-[#A89B8C] mt-1">
            {t.totalItems}: {garments.length}
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); }}
          className="px-4 py-2 bg-[#C76B3F] hover:bg-[#A85A32] text-white rounded-lg font-sans text-sm font-semibold shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          {t.addNew}
        </button>
      </header>

      {/* Add Form */}
      {showAddForm && (
        <div className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-6 shadow-2xl space-y-4">
          <h3 className="font-display text-xl font-bold text-[#F7F3EC]">{t.addNew}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.name} *</label>
              <input
                type="text"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.nameEs}</label>
              <input
                type="text"
                value={addForm.nameEs}
                onChange={(e) => setAddForm({ ...addForm, nameEs: e.target.value })}
                className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.category}</label>
              <select
                value={addForm.category}
                onChange={(e) => {
                  const cat = e.target.value as Exclude<GarmentCategory, 'all'>;
                  setAddForm({ ...addForm, category: cat, categoryTag: getCategoryTag(cat) });
                }}
                className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{language === 'es' ? c.labelEs : c.labelEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.season}</label>
              <select
                value={addForm.season}
                onChange={(e) => setAddForm({ ...addForm, season: e.target.value as SeasonTag })}
                className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none"
              >
                {SEASONS.map(s => (
                  <option key={s.value} value={s.value}>{language === 'es' ? s.labelEs : s.labelEn}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.imageUrl} *</label>
              <input
                type="text"
                value={addForm.imageUrl}
                onChange={(e) => setAddForm({ ...addForm, imageUrl: e.target.value })}
                className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.material}</label>
              <input
                type="text"
                value={addForm.material}
                onChange={(e) => setAddForm({ ...addForm, material: e.target.value })}
                className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.colorSwatch}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={addForm.colorSwatch}
                  onChange={(e) => setAddForm({ ...addForm, colorSwatch: e.target.value })}
                  className="w-10 h-9 rounded border border-[#2A2622] cursor-pointer bg-transparent"
                />
                <span className="font-mono text-xs text-[#A89B8C]">{addForm.colorSwatch}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.notes}</label>
              <textarea
                value={addForm.notes}
                onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
                rows={2}
                className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2622]">
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-[#2A2622] rounded-lg font-mono text-xs font-semibold text-[#A89B8C] hover:bg-[#161210] transition-colors">
              {t.cancel}
            </button>
            <button onClick={handleAdd} className="px-5 py-2 bg-[#C76B3F] text-white rounded-lg font-sans text-sm font-semibold shadow hover:bg-[#A85A32] transition-all flex items-center gap-2">
              <Save className="w-4 h-4" />
              {t.save}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative w-full md:w-96">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89B8C]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.search}
          className="w-full pl-10 pr-4 py-2 bg-[#1B1814] border border-[#2A2622] rounded-lg focus:border-[#C76B3F] focus:outline-none font-sans text-sm text-[#F7F3EC] transition-colors placeholder:text-[#A89B8C]"
        />
      </div>

      {/* Table */}
      <div className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#161210] border-b border-[#2A2622]">
                <th className="p-3 font-mono text-xs text-[#A89B8C] uppercase tracking-wider w-16">Img</th>
                <th className="p-3 font-mono text-xs text-[#A89B8C] uppercase tracking-wider">{t.name}</th>
                <th className="p-3 font-mono text-xs text-[#A89B8C] uppercase tracking-wider hidden md:table-cell">{t.category}</th>
                <th className="p-3 font-mono text-xs text-[#A89B8C] uppercase tracking-wider hidden lg:table-cell">{t.season}</th>
                <th className="p-3 font-mono text-xs text-[#A89B8C] uppercase tracking-wider hidden md:table-cell">{t.material}</th>
                <th className="p-3 font-mono text-xs text-[#A89B8C] uppercase tracking-wider w-24 text-center">{t.wornCount}</th>
                <th className="p-3 font-mono text-xs text-[#A89B8C] uppercase tracking-wider w-32 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2622]">
              {filteredGarments.map((g) => {
                const isEditing = editingId === g.id;
                const displayName = language === 'es' && g.nameEs ? g.nameEs : g.name;
                return (
                  <tr key={g.id} className="hover:bg-[#161210] transition-colors">
                    <td className="p-3">
                      <img src={g.imageUrl} alt={displayName} className="w-10 h-12 rounded object-cover border border-[#2A2622]" />
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full bg-[#0E0C0A] border border-[#2A2622] rounded px-2 py-1 text-xs text-[#F7F3EC] focus:border-[#C76B3F] focus:outline-none"
                        />
                      ) : (
                        <div>
                          <p className="font-sans text-sm font-medium text-[#F7F3EC] truncate max-w-[200px]">{displayName}</p>
                          <p className="font-mono text-[10px] text-[#A89B8C]">{g.categoryTag}</p>
                        </div>
                      )}
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      {isEditing ? (
                        <select
                          value={editForm.category || 'tops'}
                          onChange={(e) => {
                            const cat = e.target.value as Exclude<GarmentCategory, 'all'>;
                            setEditForm({ ...editForm, category: cat, categoryTag: getCategoryTag(cat) });
                          }}
                          className="bg-[#0E0C0A] border border-[#2A2622] rounded px-2 py-1 text-xs text-[#F7F3EC] focus:border-[#C76B3F] focus:outline-none"
                        >
                          {CATEGORIES.map(c => (
                            <option key={c.value} value={c.value}>{language === 'es' ? c.labelEs : c.labelEn}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="font-mono text-xs text-[#A89B8C]">{g.category}</span>
                      )}
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      {isEditing ? (
                        <select
                          value={editForm.season || 'all-year'}
                          onChange={(e) => setEditForm({ ...editForm, season: e.target.value as SeasonTag })}
                          className="bg-[#0E0C0A] border border-[#2A2622] rounded px-2 py-1 text-xs text-[#F7F3EC] focus:border-[#C76B3F] focus:outline-none"
                        >
                          {SEASONS.map(s => (
                            <option key={s.value} value={s.value}>{language === 'es' ? s.labelEs : s.labelEn}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="font-mono text-xs text-[#A89B8C]">{g.season}</span>
                      )}
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.material || ''}
                          onChange={(e) => setEditForm({ ...editForm, material: e.target.value })}
                          className="w-full bg-[#0E0C0A] border border-[#2A2622] rounded px-2 py-1 text-xs text-[#F7F3EC] focus:border-[#C76B3F] focus:outline-none"
                        />
                      ) : (
                        <span className="font-mono text-xs text-[#A89B8C] truncate block max-w-[120px]">{g.material || '—'}</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.wornCount ?? 0}
                          onChange={(e) => setEditForm({ ...editForm, wornCount: parseInt(e.target.value) || 0 })}
                          className="w-16 bg-[#0E0C0A] border border-[#2A2622] rounded px-2 py-1 text-xs text-[#F7F3EC] focus:border-[#C76B3F] focus:outline-none text-center"
                        />
                      ) : (
                        <span className="font-mono text-xs font-bold text-[#C76B3F]">{g.wornCount}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              className="p-1.5 text-[#C76B3F] hover:bg-[#1B1814] rounded transition-colors"
                              title={t.save}
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setEditingId(null); setEditForm({}); }}
                              className="p-1.5 text-[#A89B8C] hover:bg-[#1B1814] rounded transition-colors"
                              title={t.cancel}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                             <button
                               onClick={() => startEdit(g)}
                               aria-label={t.edit}
                               className="p-1.5 text-[#A89B8C] hover:text-[#C76B3F] hover:bg-[#1B1814] rounded transition-colors"
                               title={t.edit}
                             >
                               <Edit3 className="w-4 h-4" />
                             </button>
                             <button
                               onClick={() => setDeleteId(g.id)}
                               aria-label={t.delete}
                               className="p-1.5 text-[#A89B8C] hover:text-[#E0795A] hover:bg-[#1B1814] rounded transition-colors"
                               title={t.delete}
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                             <ConfirmDialog
                               isOpen={deleteId === g.id}
                               title={t.delete}
                               message={t.confirmDelete}
                               confirmLabel={language === 'es' ? 'Eliminar' : 'Delete'}
                               onConfirm={() => {
                                 if (deleteId) {
                                   onDeleteGarment(deleteId);
                                   setDeleteId(null);
                                 }
                               }}
                               onCancel={() => setDeleteId(null)}
                               variant="danger"
                             />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredGarments.length === 0 && (
          <div className="p-12 text-center text-[#A89B8C]">
            <Shirt className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="font-sans text-sm">{language === 'es' ? 'No se encontraron prendas' : 'No garments found'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
