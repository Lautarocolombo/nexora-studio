import React, { useState } from 'react';
import { Sparkles, Plus, Check, RefreshCw, Trash2, Heart, Shirt, Tag, DollarSign, Calendar, Layers } from 'lucide-react';
import { GarmentItem, SavedOutfit, Language } from '../types';
import { GarmentCard } from './GarmentCard';

interface OutfitBuilderProps {
  garments: GarmentItem[];
  savedOutfits: SavedOutfit[];
  onSaveOutfit: (outfit: Omit<SavedOutfit, 'id' | 'createdAt'>) => void;
  onLogOutfitWear: (outfit: SavedOutfit) => void;
  onDeleteOutfit: (outfitId: string) => void;
  language: Language;
}

export const OutfitBuilder: React.FC<OutfitBuilderProps> = ({
  garments,
  savedOutfits,
  onSaveOutfit,
  onLogOutfitWear,
  onDeleteOutfit,
  language
}) => {
  // Slots state
  const [selectedTop, setSelectedTop] = useState<GarmentItem | undefined>(
    garments.find(g => g.category === 'tops')
  );
  const [selectedBottom, setSelectedBottom] = useState<GarmentItem | undefined>(
    garments.find(g => g.category === 'bottoms')
  );
  const [selectedShoes, setSelectedShoes] = useState<GarmentItem | undefined>(
    garments.find(g => g.category === 'shoes')
  );
  const [selectedOuterwear, setSelectedOuterwear] = useState<GarmentItem | undefined>(
    garments.find(g => g.category === 'outerwear')
  );

  const [activeDrawerTab, setActiveDrawerTab] = useState<'tops' | 'bottoms' | 'shoes' | 'outerwear'>('tops');
  const [outfitName, setOutfitName] = useState('');
  const [occasion, setOccasion] = useState('Casual / Work');
  const [isSaving, setIsSaving] = useState(false);

  // Filter garments for open drawer tab
  const drawerGarments = garments.filter(g => {
    if (activeDrawerTab === 'tops') return g.category === 'tops' || g.category === 'dresses';
    if (activeDrawerTab === 'bottoms') return g.category === 'bottoms';
    if (activeDrawerTab === 'shoes') return g.category === 'shoes';
    if (activeDrawerTab === 'outerwear') return g.category === 'outerwear' || g.category === 'accessories' || g.category === 'formal';
    return true;
  });

  const handleSelectForSlot = (item: GarmentItem) => {
    if (activeDrawerTab === 'tops') setSelectedTop(item);
    else if (activeDrawerTab === 'bottoms') setSelectedBottom(item);
    else if (activeDrawerTab === 'shoes') setSelectedShoes(item);
    else if (activeDrawerTab === 'outerwear') setSelectedOuterwear(item);
  };

  const assembledItems = [selectedTop, selectedBottom, selectedShoes, selectedOuterwear].filter(Boolean) as GarmentItem[];

  const totalPrice = assembledItems.reduce((acc, g) => acc + (g.price || 0), 0);
  const totalWears = assembledItems.reduce((acc, g) => acc + (g.wornCount || 0), 0);
  const avgCostPerWear = assembledItems.length > 0 && totalPrice > 0
    ? (totalPrice / Math.max(1, totalWears / assembledItems.length)).toFixed(2)
    : '0.00';

  // Calculate Mindful Harmony Score based on matching seasons or palette
  const calculateHarmony = () => {
    if (assembledItems.length < 2) return 85;
    const seasons = assembledItems.map(g => g.season);
    const allSameSeason = seasons.every(s => s === seasons[0] || s === 'all-year');
    return allSameSeason ? 96 : 89;
  };
  const harmonyScore = calculateHarmony();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (assembledItems.length === 0 || !outfitName.trim()) return;

    onSaveOutfit({
      name: outfitName.trim(),
      nameEs: outfitName.trim(),
      items: assembledItems,
      occasion: occasion.trim() || 'Mindful Everyday',
      occasionEs: occasion.trim() || 'Diario Consciente',
      wornCount: 1,
      lastWorn: new Date().toISOString().split('T')[0],
      harmonyScore
    });

    setOutfitName('');
    setIsSaving(false);
  };

  const handleRandomize = () => {
    const tops = garments.filter(g => g.category === 'tops');
    const bottoms = garments.filter(g => g.category === 'bottoms');
    const shoes = garments.filter(g => g.category === 'shoes');
    const outers = garments.filter(g => g.category === 'outerwear' || g.category === 'accessories');

    if (tops.length) setSelectedTop(tops[Math.floor(Math.random() * tops.length)]);
    if (bottoms.length) setSelectedBottom(bottoms[Math.floor(Math.random() * bottoms.length)]);
    if (shoes.length) setSelectedShoes(shoes[Math.floor(Math.random() * shoes.length)]);
    if (outers.length) setSelectedOuterwear(outers[Math.floor(Math.random() * outers.length)]);
  };

  const t = {
    title: language === 'es' ? 'Atelier & Constructor de Atuendos' : 'Atelier & Outfit Builder',
    subtitle: language === 'es' ? 'Ensambla piezas en un lienzo consciente. Evalúa la armonía visual y el costo por uso.' : 'Assemble garments on a mindful canvas. Evaluate visual harmony and cost per wear.',
    canvasTitle: language === 'es' ? 'Lienzo de Atuendo Actual' : 'Current Outfit Canvas',
    drawerTitle: language === 'es' ? 'Cajón del Guardarropa' : 'Wardrobe Drawer',
    randomize: language === 'es' ? 'Inspiración Aleatoria' : 'Random Inspire',
    saveOutfit: language === 'es' ? 'Guardar Atuendo' : 'Save Outfit',
    harmony: language === 'es' ? 'Armonía Visual' : 'Visual Harmony',
    totalPrice: language === 'es' ? 'Inversión Total' : 'Total Investment',
    avgCost: language === 'es' ? 'Costo/Uso Promedio' : 'Avg Cost/Wear',
    savedTitle: language === 'es' ? 'Atuendos Guardados (' : 'Saved Outfits (',
    logWearAll: language === 'es' ? 'Registrar Uso para Todas las Piezas (+1)' : 'Log Wear for All Items (+1)',
    outfitNamePlaceholder: language === 'es' ? 'ej. Brunch Dominical o Reunión Elegante' : 'e.g. Sunday Brunch or Smart Client Meeting',
    occasionPlaceholder: language === 'es' ? 'ej. Trabajo, Casual, Fin de semana' : 'e.g. Work, Casual, Weekend'
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#1b1c1b] tracking-tight">{t.title}</h2>
          <p className="font-sans text-sm text-[#43474c] mt-1">{t.subtitle}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRandomize}
            className="px-4 py-2 bg-[#edf2f7] hover:bg-[#e4e2e0] text-[#455565] border border-[#c4c6cc] rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.randomize}</span>
          </button>
          <button
            onClick={() => setIsSaving(true)}
            disabled={assembledItems.length === 0}
            className="px-5 py-2 bg-[#455565] hover:bg-[#394858] disabled:opacity-50 text-white rounded-lg font-sans text-sm font-semibold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.saveOutfit}</span>
          </button>
        </div>
      </header>

      {/* Main Builder Grid: Canvas Left, Drawer Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: The Canvas (5 Cols) */}
        <section className="lg:col-span-5 fabric-grain bg-[#ffffff] border border-[#c4c6cc] rounded-xl p-6 shadow-fabric flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-[#f5f3f1] mb-6">
              <span className="font-mono text-xs font-bold text-[#455565] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                {t.canvasTitle}
              </span>
              <span className="font-mono text-xs font-bold bg-[#fed33e] text-[#735c00] px-2.5 py-0.5 rounded-full shadow-sm">
                {harmonyScore}% {t.harmony}
              </span>
            </div>

            {/* Canvas Slots */}
            <div className="space-y-4">
              {/* Top Slot */}
              <div 
                onClick={() => setActiveDrawerTab('tops')}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between ${
                  activeDrawerTab === 'tops' ? 'border-[#455565] bg-[#fbf9f7] shadow-sm' : 'border-dashed border-[#c4c6cc] hover:border-[#455565]/60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-16 bg-[#efedec] rounded overflow-hidden flex-shrink-0 border border-[#c4c6cc] flex items-center justify-center">
                    {selectedTop ? (
                      <img src={selectedTop.imageUrl} alt={selectedTop.name} className="w-full h-full object-cover" />
                    ) : (
                      <Shirt className="w-6 h-6 text-[#74777c]" />
                    )}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#455565] font-bold">[TOP / SHIRT]</span>
                    <h4 className="font-sans text-sm font-semibold text-[#1b1c1b] truncate max-w-[180px]">
                      {selectedTop ? (language === 'es' && selectedTop.nameEs ? selectedTop.nameEs : selectedTop.name) : (language === 'es' ? 'Seleccionar Top...' : 'Select Top...')}
                    </h4>
                    {selectedTop && (
                      <span className="font-mono text-[11px] text-[#43474c]">
                        {language === 'es' ? `Usado ${selectedTop.wornCount}v` : `Worn ${selectedTop.wornCount}x`}
                      </span>
                    )}
                  </div>
                </div>
                {selectedTop && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedTop(undefined); }}
                    className="text-[#74777c] hover:text-[#ba1a1a] p-1 text-xs font-mono"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Bottom Slot */}
              <div 
                onClick={() => setActiveDrawerTab('bottoms')}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between ${
                  activeDrawerTab === 'bottoms' ? 'border-[#455565] bg-[#fbf9f7] shadow-sm' : 'border-dashed border-[#c4c6cc] hover:border-[#455565]/60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-16 bg-[#efedec] rounded overflow-hidden flex-shrink-0 border border-[#c4c6cc] flex items-center justify-center">
                    {selectedBottom ? (
                      <img src={selectedBottom.imageUrl} alt={selectedBottom.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-mono text-xs text-[#74777c]">👖</span>
                    )}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#455565] font-bold">[BOTTOM / TROUSERS]</span>
                    <h4 className="font-sans text-sm font-semibold text-[#1b1c1b] truncate max-w-[180px]">
                      {selectedBottom ? (language === 'es' && selectedBottom.nameEs ? selectedBottom.nameEs : selectedBottom.name) : (language === 'es' ? 'Seleccionar Pantalón...' : 'Select Bottom...')}
                    </h4>
                    {selectedBottom && (
                      <span className="font-mono text-[11px] text-[#43474c]">
                        {language === 'es' ? `Usado ${selectedBottom.wornCount}v` : `Worn ${selectedBottom.wornCount}x`}
                      </span>
                    )}
                  </div>
                </div>
                {selectedBottom && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedBottom(undefined); }}
                    className="text-[#74777c] hover:text-[#ba1a1a] p-1 text-xs font-mono"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Shoes Slot */}
              <div 
                onClick={() => setActiveDrawerTab('shoes')}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between ${
                  activeDrawerTab === 'shoes' ? 'border-[#455565] bg-[#fbf9f7] shadow-sm' : 'border-dashed border-[#c4c6cc] hover:border-[#455565]/60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-16 bg-[#efedec] rounded overflow-hidden flex-shrink-0 border border-[#c4c6cc] flex items-center justify-center">
                    {selectedShoes ? (
                      <img src={selectedShoes.imageUrl} alt={selectedShoes.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-mono text-xs text-[#74777c]">👟</span>
                    )}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#455565] font-bold">[SHOES / FOOTWEAR]</span>
                    <h4 className="font-sans text-sm font-semibold text-[#1b1c1b] truncate max-w-[180px]">
                      {selectedShoes ? (language === 'es' && selectedShoes.nameEs ? selectedShoes.nameEs : selectedShoes.name) : (language === 'es' ? 'Seleccionar Calzado...' : 'Select Shoes...')}
                    </h4>
                    {selectedShoes && (
                      <span className="font-mono text-[11px] text-[#43474c]">
                        {language === 'es' ? `Usado ${selectedShoes.wornCount}v` : `Worn ${selectedShoes.wornCount}x`}
                      </span>
                    )}
                  </div>
                </div>
                {selectedShoes && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedShoes(undefined); }}
                    className="text-[#74777c] hover:text-[#ba1a1a] p-1 text-xs font-mono"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Outerwear / Accessory Slot */}
              <div 
                onClick={() => setActiveDrawerTab('outerwear')}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between ${
                  activeDrawerTab === 'outerwear' ? 'border-[#455565] bg-[#fbf9f7] shadow-sm' : 'border-dashed border-[#c4c6cc] hover:border-[#455565]/60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-16 bg-[#efedec] rounded overflow-hidden flex-shrink-0 border border-[#c4c6cc] flex items-center justify-center">
                    {selectedOuterwear ? (
                      <img src={selectedOuterwear.imageUrl} alt={selectedOuterwear.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-mono text-xs text-[#74777c]">🧥</span>
                    )}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#455565] font-bold">[OUTERWEAR / LAYER]</span>
                    <h4 className="font-sans text-sm font-semibold text-[#1b1c1b] truncate max-w-[180px]">
                      {selectedOuterwear ? (language === 'es' && selectedOuterwear.nameEs ? selectedOuterwear.nameEs : selectedOuterwear.name) : (language === 'es' ? 'Opcional: Abrigo o Accesorio...' : 'Optional: Outerwear/Layer...')}
                    </h4>
                    {selectedOuterwear && (
                      <span className="font-mono text-[11px] text-[#43474c]">
                        {language === 'es' ? `Usado ${selectedOuterwear.wornCount}v` : `Worn ${selectedOuterwear.wornCount}x`}
                      </span>
                    )}
                  </div>
                </div>
                {selectedOuterwear && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedOuterwear(undefined); }}
                    className="text-[#74777c] hover:text-[#ba1a1a] p-1 text-xs font-mono"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Canvas Metrics Footer */}
          <div className="mt-8 pt-4 border-t border-[#f5f3f1] grid grid-cols-2 gap-4">
            <div className="bg-[#f5f3f1] p-3 rounded border border-[#e4e2e0]">
              <span className="font-mono text-[10px] text-[#43474c] uppercase block">{t.totalPrice}</span>
              <span className="font-serif text-lg font-bold text-[#1b1c1b]">${totalPrice}</span>
            </div>
            <div className="bg-[#f5f3f1] p-3 rounded border border-[#e4e2e0]">
              <span className="font-mono text-[10px] text-[#43474c] uppercase block">{t.avgCost}</span>
              <span className="font-serif text-lg font-bold text-[#735c00]">${avgCostPerWear}</span>
            </div>
          </div>
        </section>

        {/* Right: Wardrobe Selector Drawer (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-xl font-bold text-[#1b1c1b]">{t.drawerTitle}</h3>
            <span className="font-mono text-xs text-[#43474c]">
              {language === 'es' ? 'Hagá clic para seleccionar en la ranura activa' : 'Click to equip in active slot'}
            </span>
          </div>

          {/* Drawer Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 border-b border-[#c4c6cc]">
            {(['tops', 'bottoms', 'shoes', 'outerwear'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveDrawerTab(tab)}
                className={`px-4 py-2 font-mono text-xs uppercase font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeDrawerTab === tab 
                    ? 'border-[#455565] text-[#455565] bg-[#edf2f7] rounded-t-lg' 
                    : 'border-transparent text-[#43474c] hover:text-[#1b1c1b]'
                }`}
              >
                {tab === 'tops' && (language === 'es' ? 'Tops / Camisas' : 'Tops / Shirts')}
                {tab === 'bottoms' && (language === 'es' ? 'Pantalones' : 'Bottoms')}
                {tab === 'shoes' && (language === 'es' ? 'Calzado' : 'Shoes')}
                {tab === 'outerwear' && (language === 'es' ? 'Abrigos & Acc.' : 'Outerwear & Acc')}
              </button>
            ))}
          </div>

          {/* Drawer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[520px] pr-1">
            {drawerGarments.map(item => {
              const isSelected = assembledItems.some(i => i.id === item.id);
              return (
                <div key={item.id} className="h-[280px]">
                  <GarmentCard
                    garment={item}
                    language={language}
                    onCardClick={() => {}}
                    onLogWear={() => {}}
                    onToggleFavorite={() => {}}
                    isSelectableForBuilder={true}
                    isSelectedForBuilder={isSelected}
                    onSelectForBuilder={handleSelectForSlot}
                  />
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Save Outfit Modal */}
      {isSaving && (
        <div className="fixed inset-0 z-50 bg-[#1b1c1b]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="fabric-grain bg-[#ffffff] w-full max-w-md rounded-xl border border-[#c4c6cc] shadow-2xl p-6">
            <h3 className="font-serif text-xl font-bold text-[#1b1c1b] mb-2">{t.saveOutfit}</h3>
            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div>
                <label className="block font-mono text-xs text-[#43474c] uppercase mb-1">
                  {language === 'es' ? 'Nombre del Atuendo *' : 'Outfit Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={outfitName}
                  onChange={e => setOutfitName(e.target.value)}
                  placeholder={t.outfitNamePlaceholder}
                  className="w-full bg-[#fbf9f7] border border-[#c4c6cc] focus:border-[#d4ac0d] rounded px-3 py-2 text-sm text-[#1b1c1b] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-xs text-[#43474c] uppercase mb-1">
                  {language === 'es' ? 'Ocasión / Etiqueta' : 'Occasion / Tag'}
                </label>
                <input
                  type="text"
                  value={occasion}
                  onChange={e => setOccasion(e.target.value)}
                  placeholder={t.occasionPlaceholder}
                  className="w-full bg-[#fbf9f7] border border-[#c4c6cc] focus:border-[#d4ac0d] rounded px-3 py-2 text-sm text-[#1b1c1b] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#c4c6cc]">
                <button
                  type="button"
                  onClick={() => setIsSaving(false)}
                  className="px-4 py-2 border border-[#c4c6cc] rounded-lg font-mono text-xs font-semibold text-[#43474c] hover:bg-[#efedec]"
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#455565] text-white rounded-lg font-sans text-sm font-semibold shadow hover:bg-[#394858]"
                >
                  {language === 'es' ? 'Guardar Atuendo' : 'Save Outfit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Saved Outfits Showcase Section */}
      <section className="pt-8 border-t border-[#c4c6cc]">
        <h3 className="font-serif text-2xl font-bold text-[#1b1c1b] mb-6">
          {t.savedTitle}{savedOutfits.length})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedOutfits.map(outfit => {
            const name = language === 'es' && outfit.nameEs ? outfit.nameEs : outfit.name;
            const occ = language === 'es' && outfit.occasionEs ? outfit.occasionEs : outfit.occasion;
            return (
              <div 
                key={outfit.id}
                className="fabric-grain bg-[#ffffff] border border-[#c4c6cc] rounded-xl p-5 shadow-fabric hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-mono text-[11px] text-[#735c00] font-semibold tracking-wider uppercase">
                        {occ}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[#1b1c1b] mt-0.5">{name}</h4>
                    </div>
                    <span className="font-mono text-xs font-bold bg-[#edf2f7] text-[#455565] px-2 py-0.5 rounded">
                      {outfit.harmonyScore || 95}% Harm.
                    </span>
                  </div>

                  {/* Outfit Preview Swatches Grid */}
                  <div className="grid grid-cols-4 gap-2 my-4 bg-[#f5f3f1] p-2 rounded-lg border border-[#e4e2e0]">
                    {outfit.items.map((item, idx) => (
                      <div key={idx} className="aspect-square bg-[#efedec] rounded overflow-hidden border border-[#c4c6cc]" title={item.name}>
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f5f3f1] flex justify-between items-center mt-auto">
                  <span className="font-mono text-xs text-[#43474c]">
                    {language === 'es' ? `Usado ${outfit.wornCount} veces` : `Worn ${outfit.wornCount} times`}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => onLogOutfitWear(outfit)}
                      className="bg-[#455565] hover:bg-[#394858] text-white px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Usado Hoy (+1)' : 'Worn Today (+1)'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(language === 'es' ? '¿Eliminar este atuendo?' : 'Delete outfit?')) {
                          onDeleteOutfit(outfit.id);
                        }
                      }}
                      className="p-1.5 text-[#74777c] hover:text-[#ba1a1a] transition-colors rounded hover:bg-[#efedec]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
