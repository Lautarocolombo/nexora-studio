import React, { useState } from 'react';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { GarmentItem, GarmentCategory, SeasonTag, Language } from '../types';
import { useAccessibleModal } from '../hooks/useAccessibleModal';

interface AddGarmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGarment: (newGarment: Omit<GarmentItem, 'id'>) => void;
  language: Language;
}

const SAMPLE_IMAGES = [
  { label: 'Linen Shirt', url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop' },
  { label: 'Wool Knit', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop' },
  { label: 'Tailored Trousers', url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&auto=format&fit=crop' },
  { label: 'Denim Jacket', url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop' },
  { label: 'Leather Oxfords', url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop' },
  { label: 'Trench Coat', url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=800&auto=format&fit=crop' }
];

export const AddGarmentModal: React.FC<AddGarmentModalProps> = ({
  isOpen,
  onClose,
  onAddGarment,
  language
}) => {
  const [name, setName] = useState('');
  const [nameEs, setNameEs] = useState('');
  const [category, setCategory] = useState<Exclude<GarmentCategory, 'all'>>('tops');
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0].url);
  const [material, setMaterial] = useState('');
  const [season, setSeason] = useState<SeasonTag>('all-year');
  const [wornCount, setWornCount] = useState<string>('0');
  const [notes, setNotes] = useState('');
  const [colorSwatch, setColorSwatch] = useState('#455565');

  const getTagForCategory = (cat: Exclude<GarmentCategory, 'all'>) => {
    switch (cat) {
      case 'tops': return '[TOP]';
      case 'bottoms': return '[BOTTOM]';
      case 'shoes': return '[SHOES]';
      case 'outerwear': return '[OUTERWEAR]';
      case 'accessories': return '[ACCESSORY]';
      case 'dresses': return '[DRESS]';
      case 'formal': return '[FORMAL]';
      default: return '[ITEM]';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddGarment({
      name: name.trim(),
      nameEs: nameEs.trim() || name.trim(),
      category,
      categoryTag: getTagForCategory(category),
      imageUrl: imageUrl.trim() || SAMPLE_IMAGES[0].url,
      material: material.trim() || undefined,
      season,
      wornCount: parseInt(wornCount, 10) || 0,
      notes: notes.trim() || undefined,
      colorSwatch: colorSwatch || undefined,
      lastWorn: new Date().toISOString().split('T')[0],
      favorite: false
    });

    onClose();
  };

  const t = {
    title: language === 'es' ? 'Añadir Prenda a tu Armario' : 'Add Garment to Your Wardrobe',
    subtitle: language === 'es' ? 'Registrá la prenda para armar conjuntos y llevar un historial de usos.' : 'Register the garment to build outfits and track wears.',
    name: language === 'es' ? 'Nombre de la Prenda (Inglés/Principal)' : 'Garment Name',
    nameEs: language === 'es' ? 'Nombre en Español' : 'Spanish Name (Optional)',
    category: language === 'es' ? 'Categoría' : 'Category',
    season: language === 'es' ? 'Temporada' : 'Season',
    image: language === 'es' ? 'URL de Fotografía o Muestra de Estilo' : 'Photo URL or Style Sample',
    wears: language === 'es' ? 'Usos Iniciales Registrados' : 'Initial Worn Count',
    material: language === 'es' ? 'Composición / Material (ej. 100% Lino Orgánico)' : 'Material (e.g. 100% Organic Linen)',
    notes: language === 'es' ? 'Notas de Estilo / Sastrería' : 'Style & Tailor Notes',
    cancel: language === 'es' ? 'Cancelar' : 'Cancel',
    save: language === 'es' ? 'Guardar en Armario' : 'Save to Wardrobe'
  };

  const { modalRef, closeOnBackdrop } = useAccessibleModal({
    isOpen: isOpen,
    onClose,
    initialFocusRef: { current: null },
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0E0C0A]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-garment-title"
        className="fabric-grain bg-[#1B1814] w-full max-w-2xl rounded-2xl border border-[#2A2622] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#161210] border-b border-[#2A2622] flex justify-between items-center">
          <div>
            <h2 id="add-garment-title" className="font-display text-2xl font-bold text-[#F7F3EC]">{t.title}</h2>
            <p className="font-sans text-xs text-[#A89B8C] mt-0.5">{t.subtitle}</p>
          </div>
          <button 
            onClick={onClose}
            aria-label={language === 'es' ? 'Cerrar formulario' : 'Close form'}
            className="p-1.5 text-[#A89B8C] hover:text-[#F7F3EC] rounded-lg hover:bg-[#1B1814] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 font-sans text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.name} *</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. White Linen Shirt"
                className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-[#F7F3EC] focus:outline-none"
              />
            </div>
            {/* Name Es */}
            <div>
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.nameEs}</label>
              <input 
                type="text" 
                value={nameEs}
                onChange={(e) => setNameEs(e.target.value)}
                placeholder="ej. Camisa de Lino Blanco"
                className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-[#F7F3EC] focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Season */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.category}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-[#F7F3EC] focus:outline-none capitalize"
              >
                <option value="tops">Tops [TOP]</option>
                <option value="bottoms">Bottoms [BOTTOM]</option>
                <option value="shoes">Shoes [SHOES]</option>
                <option value="outerwear">Outerwear [OUTERWEAR]</option>
                <option value="accessories">Accessories [ACCESSORY]</option>
                <option value="dresses">Dresses [DRESS]</option>
                <option value="formal">Formal [FORMAL]</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.season}</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as any)}
                className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-[#F7F3EC] focus:outline-none"
              >
                <option value="all-year">{language === 'es' ? 'Todo el año' : 'All Year'}</option>
                <option value="spring-summer">{language === 'es' ? 'Primavera / Verano' : 'Spring / Summer'}</option>
                <option value="autumn-winter">{language === 'es' ? 'Otoño / Invierno' : 'Autumn / Winter'}</option>
              </select>
            </div>
          </div>

          {/* Image Selection */}
          <div>
            <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.image}</label>
            <input 
              type="url" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-[#F7F3EC] focus:outline-none text-xs font-mono mb-2"
            />
            
            {/* Quick Sample Swatches */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="font-mono text-xs text-[#6B6358] whitespace-nowrap">Presets:</span>
              {SAMPLE_IMAGES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(sample.url)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs border whitespace-nowrap transition-all ${
                    imageUrl === sample.url 
                      ? 'bg-[#C76B3F] text-white border-[#C76B3F]' 
                      : 'bg-[#1B1814] text-[#A89B8C] border-[#2A2622] hover:bg-[#161210]'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Wears, Material & Color Swatch */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.wears}</label>
              <input
                type="number"
                min="0"
                value={wornCount}
                onChange={(e) => setWornCount(e.target.value)}
                className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-[#F7F3EC] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.material}</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="100% Organic Linen / 14.5oz Japanese Selvedge"
                className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-[#F7F3EC] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorSwatch}
                  onChange={(e) => setColorSwatch(e.target.value)}
                  className="w-full h-9 rounded border border-[#2A2622] cursor-pointer bg-transparent p-0.5"
                  aria-label="Color swatch"
                />
                <span className="font-mono text-xs text-[#A89B8C] hidden md:inline">{colorSwatch}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1 font-medium">{t.notes}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Fit details, matching recommendations, maintenance notes..."
              rows={2}
              className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-[#F7F3EC] focus:outline-none"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2622]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#2A2622] rounded-lg font-mono text-xs font-semibold text-[#A89B8C] hover:bg-[#1B1814] transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#C76B3F] text-[#0B0A08] rounded-lg font-sans text-sm font-semibold shadow hover:bg-[#b36138] transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};