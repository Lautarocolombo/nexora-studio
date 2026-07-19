import React, { useState, useMemo, useCallback } from 'react';
import { Search, Filter, ArrowUpDown, Plus, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GarmentItem, GarmentCategory, SeasonTag, Language } from '../types';
import { GarmentCard } from './GarmentCard';

interface WardrobeViewProps {
  garments: GarmentItem[];
  language: Language;
  onCardClick: (garment: GarmentItem) => void;
  onLogWear: (e: React.MouseEvent, garment: GarmentItem) => void;
  onToggleFavorite: (e: React.MouseEvent, garmentId: string) => void;
  onOpenAddModal: () => void;
}

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  garments,
  language,
  onCardClick,
  onLogWear,
  onToggleFavorite,
  onOpenAddModal
}) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<GarmentCategory | 'favorites'>('all');
  const [selectedSeason, setSelectedSeason] = useState<SeasonTag | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'most-worn' | 'least-worn' | 'recent' | 'name'>('most-worn');

  const handleCategoryChange = useCallback((cat: GarmentCategory | 'favorites') => setSelectedCategory(cat), []);
  const handleSeasonChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSeason(e.target.value as SeasonTag | 'all'), []);
  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'most-worn' | 'least-worn' | 'recent' | 'name'), []);
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value), []);
  const handleClearSearch = useCallback(() => setSearchQuery(''), []);

  const categories: { id: GarmentCategory | 'favorites'; label: string }[] = [
    { id: 'all', label: t('wardrobe.all') },
    { id: 'tops', label: 'Tops' },
    { id: 'bottoms', label: 'Bottoms' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'outerwear', label: 'Outerwear' },
    { id: 'accessories', label: t('wardrobe.catAcc') },
    { id: 'favorites', label: t('wardrobe.favorites') }
  ];

  const filteredGarments = useMemo(() => {
    return garments.filter(item => {
      if (selectedCategory === 'favorites') {
        if (!item.favorite) return false;
      } else if (selectedCategory !== 'all') {
        if (selectedCategory === 'outerwear') {
          if (item.category !== 'outerwear' && item.category !== 'formal') return false;
        } else if (selectedCategory === 'tops') {
          if (item.category !== 'tops' && item.category !== 'dresses') return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      if (selectedSeason !== 'all') {
        if (item.season !== selectedSeason && item.season !== 'all-year') return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchNameEs = item.nameEs?.toLowerCase().includes(query);
        const matchMaterial = item.material?.toLowerCase().includes(query);
        const matchBrand = item.brand?.toLowerCase().includes(query);
        const matchNotes = item.notes?.toLowerCase().includes(query);
        const matchTag = item.categoryTag.toLowerCase().includes(query);
        if (!matchName && !matchNameEs && !matchMaterial && !matchBrand && !matchNotes && !matchTag) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'most-worn') return b.wornCount - a.wornCount;
      if (sortBy === 'least-worn') return a.wornCount - b.wornCount;
      if (sortBy === 'recent') return (b.lastWorn || '').localeCompare(a.lastWorn || '');
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [garments, selectedCategory, selectedSeason, searchQuery, sortBy]);

  return (
    <div className="space-y-8 animate-page-enter">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#F7F3EC] tracking-tight">{t('wardrobe.title')}</h2>
          <span className="font-mono text-xs text-[#A89B8C] bg-[#1B1814] px-2.5 py-1 rounded border border-[#2A2622]">
            {filteredGarments.length} {t('wardrobe.itemsCount')}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89B8C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('wardrobe.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 bg-[#1B1814] border border-[#2A2622] rounded-lg focus:border-[#C76B3F] focus:outline-none font-sans text-sm text-[#F7F3EC] transition-colors placeholder:text-[#A89B8C]"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                aria-label={t('wardrobe.clearSearch')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#A89B8C] hover:text-[#F7F3EC]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-[#1B1814] px-3 py-1.5 rounded-lg border border-[#2A2622]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#C76B3F]" />
          <select
            value={sortBy}
            onChange={handleSortChange}
            aria-label={t('wardrobe.sortLabel')}
            className="bg-transparent font-mono text-xs text-[#F7F3EC] focus:outline-none cursor-pointer pr-1"
          >
              <option value="most-worn">{t('wardrobe.mostWorn')}</option>
              <option value="least-worn">{t('wardrobe.leastWorn')}</option>
              <option value="recent">{t('wardrobe.recent')}</option>
              <option value="name">{t('wardrobe.nameAsc')}</option>
            </select>
          </div>
        </div>
      </header>

      <section className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex flex-wrap gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-1.5 font-mono text-xs rounded-full transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#C76B3F] text-[#0B0A08] border border-[#C76B3F] font-semibold shadow-sm'
                    : 'bg-[#1B1814] text-[#A89B8C] border border-[#2A2622] hover:bg-[#161210] hover:text-[#F7F3EC]'
                }`}
              >
                {cat.id === 'favorites' && <Heart className={`w-3 h-3 ${isActive ? 'fill-[#0B0A08]' : ''}`} />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#A89B8C]">
          <Filter className="w-3.5 h-3.5 text-[#C76B3F]" />
          <select
            value={selectedSeason}
            onChange={handleSeasonChange}
            aria-label={t('wardrobe.filterSeason')}
            className="bg-[#1B1814] border border-[#2A2622] rounded px-2.5 py-1 text-[#F7F3EC] focus:outline-none cursor-pointer"
          >
            <option value="all">{t('wardrobe.seasonAll')}</option>
            <option value="spring-summer">{t('wardrobe.seasonSS')}</option>
            <option value="autumn-winter">{t('wardrobe.seasonAW')}</option>
          </select>
        </div>
      </section>

      {filteredGarments.length > 0 ? (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGarments.map((item, idx) => (
            <GarmentCard
              key={item.id}
              garment={item}
              language={language}
              onCardClick={onCardClick}
              onLogWear={onLogWear}
              onToggleFavorite={onToggleFavorite}
              index={idx}
            />
          ))}
        </section>
      ) : (
        <section className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-2xl p-12 text-center shadow-fabric my-8 max-w-lg mx-auto">
          <div className="w-12 h-12 bg-[#161210] rounded-full flex items-center justify-center mx-auto mb-4 text-[#C76B3F]">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-[#F7F3EC] mb-1">{t('wardrobe.emptyTitle')}</h3>
          <p className="font-sans text-sm text-[#A89B8C] mb-1">{t('wardrobe.emptyDesc')}</p>
          <p className="font-mono text-xs text-[#A89B8C] mb-6">
            {t('wardrobe.emptyHint')}
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 bg-[#C76B3F] hover:bg-[#b36138] text-[#0B0A08] rounded-lg font-sans text-sm font-semibold shadow-md inline-flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t('wardrobe.addNew')}</span>
          </button>
        </section>
      )}
    </div>
  );
};
