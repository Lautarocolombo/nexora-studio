import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Plus, Sparkles, Heart } from 'lucide-react';
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
  const [selectedCategory, setSelectedCategory] = useState<GarmentCategory | 'favorites'>('all');
  const [selectedSeason, setSelectedSeason] = useState<SeasonTag | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'most-worn' | 'least-worn' | 'recent' | 'name'>('most-worn');

  const t = {
    title: language === 'es' ? 'Tu Guardarropa' : 'Your Wardrobe',
    searchPlaceholder: language === 'es' ? 'Buscar en el guardarropa...' : 'Search wardrobe...',
    all: language === 'es' ? 'Todas' : 'All',
    tops: 'Tops',
    bottoms: 'Bottoms',
    shoes: 'Shoes',
    outerwear: 'Outerwear',
    accessories: 'Accesorios',
    favorites: language === 'es' ? 'Favoritas' : 'Favorites',
    itemsCount: language === 'es' ? 'prendas en catálogo' : 'items cataloged',
    sortLabel: language === 'es' ? 'Ordenar por:' : 'Sort by:',
    mostWorn: language === 'es' ? 'Más Usados' : 'Most Worn',
    leastWorn: language === 'es' ? 'Menos Usados' : 'Least Worn',
    recent: language === 'es' ? 'Usados Recientemente' : 'Recently Worn',
    nameAsc: language === 'es' ? 'Alfabético' : 'Alphabetical',
    seasonAll: language === 'es' ? 'Todas las Temporadas' : 'All Seasons',
    seasonSS: language === 'es' ? 'Primavera / Verano' : 'Spring / Summer',
    seasonAW: language === 'es' ? 'Otoño / Invierno' : 'Autumn / Winter',
    emptyTitle: language === 'es' ? 'No se encontraron prendas' : 'No garments found',
    emptyDesc: language === 'es' ? 'Probá cambiar los filtros o la búsqueda.' : 'Try adjusting your filters or search.',
    addNew: language === 'es' ? 'Añadir Prenda' : 'Add Garment'
  };

  const categories: { id: GarmentCategory | 'favorites'; label: string }[] = [
    { id: 'all', label: t.all },
    { id: 'tops', label: t.tops },
    { id: 'bottoms', label: t.bottoms },
    { id: 'shoes', label: t.shoes },
    { id: 'outerwear', label: t.outerwear },
    { id: 'accessories', label: t.accessories },
    { id: 'favorites', label: t.favorites }
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
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#F7F3EC] tracking-tight">{t.title}</h2>
          <span className="font-mono text-xs text-[#A89B8C] bg-[#1B1814] px-2.5 py-1 rounded border border-[#2A2622]">
            {filteredGarments.length} {t.itemsCount}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89B8C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-[#1B1814] border border-[#2A2622] rounded-lg focus:border-[#C76B3F] focus:outline-none font-sans text-sm text-[#F7F3EC] transition-colors placeholder:text-[#A89B8C]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
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
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-mono text-xs text-[#F7F3EC] focus:outline-none cursor-pointer pr-1"
            >
              <option value="most-worn">{t.mostWorn}</option>
              <option value="least-worn">{t.leastWorn}</option>
              <option value="recent">{t.recent}</option>
              <option value="name">{t.nameAsc}</option>
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
                onClick={() => setSelectedCategory(cat.id)}
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
            onChange={(e) => setSelectedSeason(e.target.value as any)}
            className="bg-[#1B1814] border border-[#2A2622] rounded px-2.5 py-1 text-[#F7F3EC] focus:outline-none cursor-pointer"
          >
            <option value="all">{t.seasonAll}</option>
            <option value="spring-summer">{t.seasonSS}</option>
            <option value="autumn-winter">{t.seasonAW}</option>
          </select>
        </div>
      </section>

      {filteredGarments.length > 0 ? (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGarments.map((item) => (
            <GarmentCard
              key={item.id}
              garment={item}
              language={language}
              onCardClick={onCardClick}
              onLogWear={onLogWear}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </section>
      ) : (
        <section className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-2xl p-12 text-center shadow-fabric my-8 max-w-lg mx-auto">
          <div className="w-12 h-12 bg-[#161210] rounded-full flex items-center justify-center mx-auto mb-4 text-[#C76B3F]">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-[#F7F3EC] mb-1">{t.emptyTitle}</h3>
          <p className="font-sans text-sm text-[#A89B8C] mb-6">{t.emptyDesc}</p>
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 bg-[#C76B3F] hover:bg-[#b36138] text-[#0B0A08] rounded-lg font-sans text-sm font-semibold shadow-md inline-flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addNew}</span>
          </button>
        </section>
      )}
    </div>
  );
};