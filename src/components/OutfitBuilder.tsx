import React, { useState, useMemo } from 'react';
import { Sparkles, RefreshCw, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GarmentItem, SavedOutfit, Language } from '../types';
import { GarmentCard } from './GarmentCard';
import { ConfirmDialog } from './ConfirmDialog';
import { OutfitSlot } from './outfit/OutfitSlot';
import { SaveOutfitModal } from './outfit/SaveOutfitModal';
import { SavedOutfitCard } from './outfit/SavedOutfitCard';

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
  const { t } = useTranslation();
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
  const [isSaving, setIsSaving] = useState(false);
  const [outfitToDelete, setOutfitToDelete] = useState<string | null>(null);

  const garmentIndex = useMemo(() => {
    const map = new Map<string, GarmentItem>();
    for (const g of garments) map.set(g.id, g);
    return map;
  }, [garments]);

  const drawerGarments = useMemo(() => {
    return garments.filter(g => {
      if (activeDrawerTab === 'tops') return g.category === 'tops' || g.category === 'dresses';
      if (activeDrawerTab === 'bottoms') return g.category === 'bottoms';
      if (activeDrawerTab === 'shoes') return g.category === 'shoes';
      if (activeDrawerTab === 'outerwear') return g.category === 'outerwear' || g.category === 'accessories' || g.category === 'formal';
      return true;
    });
  }, [garments, activeDrawerTab]);

  const handleSelectForSlot = (item: GarmentItem) => {
    if (activeDrawerTab === 'tops') setSelectedTop(item);
    else if (activeDrawerTab === 'bottoms') setSelectedBottom(item);
    else if (activeDrawerTab === 'shoes') setSelectedShoes(item);
    else if (activeDrawerTab === 'outerwear') setSelectedOuterwear(item);
  };

  const assembledItems = [selectedTop, selectedBottom, selectedShoes, selectedOuterwear].filter(Boolean) as GarmentItem[];

  const totalWears = assembledItems.reduce((acc, g) => acc + (g.wornCount || 0), 0);
  const versatilityScore = assembledItems.length > 0 ? Math.min(100, 60 + assembledItems.length * 10 + Math.floor(totalWears / Math.max(1, assembledItems.length))) : 0;

  const harmonyScore = useMemo(() => {
    if (assembledItems.length < 2) return 85;
    const seasons = assembledItems.map(g => g.season);
    return seasons.every(s => s === seasons[0] || s === 'all-year') ? 96 : 89;
  }, [assembledItems]);

  const handleSave = (name: string, occasion: string) => {
    if (assembledItems.length === 0) return;
    onSaveOutfit({
      name,
      nameEs: name,
      garmentIds: assembledItems.map(i => i.id),
      occasion,
      occasionEs: occasion,
      wornCount: 1,
      lastWorn: new Date().toISOString().split('T')[0],
      harmonyScore
    });
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

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-[#F7F3EC] tracking-tight">{t('builder.title')}</h2>
          <p className="font-sans text-sm text-[#A89B8C] mt-1">{t('builder.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleRandomize} className="px-4 py-2 bg-[#1B1814] hover:bg-[#161210] text-[#A89B8C] border border-[#2A2622] rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('builder.randomize')}</span>
          </button>
          <button onClick={() => setIsSaving(true)} disabled={assembledItems.length === 0} className="px-5 py-2 bg-[#C76B3F] hover:bg-[#A85A32] disabled:opacity-50 text-white rounded-lg font-sans text-sm font-semibold shadow-md flex items-center gap-1.5 transition-all">
            <Sparkles className="w-4 h-4" />
            <span>{t('builder.saveOutfit')}</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-5 fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-[#2A2622] mb-6">
              <span className="font-mono text-xs font-bold text-[#A89B8C] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                {t('builder.canvasTitle')}
              </span>
              <span className="font-mono text-xs font-bold bg-[#C76B3F] text-white px-2.5 py-0.5 rounded-full shadow-sm">
                {harmonyScore}% {t('builder.harmony')}
              </span>
            </div>

            <div className="space-y-4">
              <OutfitSlot
                label={t('builder.topLabel')}
                tagLabel="[TOP / SHIRT]"
                placeholder={t('builder.topPlaceholder')}
                item={selectedTop}
                isActive={activeDrawerTab === 'tops'}
                language={language}
                onSelect={() => setActiveDrawerTab('tops')}
                onRemove={() => setSelectedTop(undefined)}
              />
              <OutfitSlot
                label={t('builder.bottomLabel')}
                tagLabel="[BOTTOM / TROUSERS]"
                placeholder={t('builder.bottomPlaceholder')}
                item={selectedBottom}
                isActive={activeDrawerTab === 'bottoms'}
                language={language}
                onSelect={() => setActiveDrawerTab('bottoms')}
                onRemove={() => setSelectedBottom(undefined)}
              />
              <OutfitSlot
                label={t('builder.shoesLabel')}
                tagLabel="[SHOES / FOOTWEAR]"
                placeholder={t('builder.shoesPlaceholder')}
                item={selectedShoes}
                isActive={activeDrawerTab === 'shoes'}
                language={language}
                onSelect={() => setActiveDrawerTab('shoes')}
                onRemove={() => setSelectedShoes(undefined)}
              />
              <OutfitSlot
                label={t('builder.outerwearLabel')}
                tagLabel="[OUTERWEAR / LAYER]"
                placeholder={t('builder.outerwearPlaceholder')}
                item={selectedOuterwear}
                isActive={activeDrawerTab === 'outerwear'}
                language={language}
                onSelect={() => setActiveDrawerTab('outerwear')}
                onRemove={() => setSelectedOuterwear(undefined)}
              />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#2A2622] grid grid-cols-2 gap-4">
            <div className="bg-[#161210] p-3 rounded border border-[#2A2622]">
               <span className="font-mono text-xs text-[#A89B8C] uppercase block">{t('builder.totalPieces')}</span>
              <span className="font-display text-lg font-bold text-[#F7F3EC]">{assembledItems.length}</span>
            </div>
            <div className="bg-[#161210] p-3 rounded border border-[#2A2622]">
               <span className="font-mono text-xs text-[#A89B8C] uppercase block">{t('builder.versatility')}</span>
              <span className="font-display text-lg font-bold text-[#C76B3F]">{versatilityScore}%</span>
            </div>
          </div>
        </section>

        <section className="lg:col-span-7 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-xl font-bold text-[#F7F3EC]">{t('builder.drawerTitle')}</h3>
            <span className="font-mono text-xs text-[#A89B8C]">{t('builder.clickEquipHint')}</span>
          </div>

          <div role="tablist" className="flex gap-2 mb-6 overflow-x-auto pb-1 border-b border-[#2A2622]">
            {(['tops', 'bottoms', 'shoes', 'outerwear'] as const).map(tab => (
              <button key={tab} role="tab" aria-selected={activeDrawerTab === tab} onClick={() => setActiveDrawerTab(tab)} className={`px-4 py-2 font-mono text-xs uppercase font-semibold border-b-2 transition-all whitespace-nowrap ${activeDrawerTab === tab ? 'border-[#C76B3F] text-[#C76B3F] bg-[#1B1814] rounded-t-lg' : 'border-transparent text-[#A89B8C] hover:text-[#F7F3EC]'}`}>
                {tab === 'tops' && t('builder.tabTops')}
                {tab === 'bottoms' && t('builder.tabBottoms')}
                {tab === 'shoes' && t('builder.tabShoes')}
                {tab === 'outerwear' && t('builder.tabOuterwear')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[520px] pr-1">
            {drawerGarments.map(item => (
              <div key={item.id} className="h-[280px]">
                <GarmentCard
                  garment={item}
                  language={language}
                  onCardClick={() => {}}
                  onLogWear={() => {}}
                  onToggleFavorite={() => {}}
                  isSelectableForBuilder
                  isSelectedForBuilder={assembledItems.some(i => i.id === item.id)}
                  onSelectForBuilder={handleSelectForSlot}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <SaveOutfitModal
        isOpen={isSaving}
        onClose={() => setIsSaving(false)}
        onSave={handleSave}
        pieceCount={assembledItems.length}
      />

      <section className="pt-8 border-t border-[#2A2622]">
        <h3 className="font-display text-2xl font-bold text-[#F7F3EC] mb-6">
          {t('builder.savedTitle')}{savedOutfits.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedOutfits.map(outfit => (
            <SavedOutfitCard
              key={outfit.id}
              outfit={outfit}
              language={language}
              garmentIndex={garmentIndex}
              onLogWear={onLogOutfitWear}
              onDelete={setOutfitToDelete}
            />
          ))}
        </div>
      </section>

      <ConfirmDialog
        isOpen={!!outfitToDelete}
        title={t('builder.deleteTitle')}
        message={t('builder.deleteMessage')}
        confirmLabel={t('builder.deleteConfirm')}
        onConfirm={() => { if (outfitToDelete) { onDeleteOutfit(outfitToDelete); setOutfitToDelete(null); } }}
        onCancel={() => setOutfitToDelete(null)}
        variant="danger"
      />
    </div>
  );
};
