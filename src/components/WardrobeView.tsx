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
  const [sortBy, setSortBy] = useState<'most-worn' | 'least-worn' | 'price-desc' | 'name'>('most-worn');

  const t = {
    title: language === 'es' ? 'Tu Guardarropa' : 'Your Wardrobe',
    searchPlaceholder: language === 'es' ? 'Buscar en el guardarropa...' : 'Search wardrobe...',
    all: language === 'es' ? 'All' : 'All', // Kept All as screenshot has All even with Spanish title
    tops: 'Tops',
    bottoms: 'Bottoms',
    shoes: 'Shoes',
    outerwear: 'Outerwear',
    accessories: language === 'es' ? 'Accessories' : 'Accessories',
    favorites: language === 'es' ? 'Favorites' : 'Favorites',
    itemsCount: language === 'es' ? 'prendas en catálogo' : 'items cataloged',
    sortLabel: language === 'es' ? 'Ordenar por:' : 'Sort by:',
    mostWorn: language === 'es' ? 'Más Usados' : 'Most Worn',
    leastWorn: language === 'es' ? 'Menos Usados (Poco amor)' : 'Least Worn (Need love)',
    priceDesc: language === 'es' ? 'Mayor Inversión ($)' : 'Highest Price ($)',
    nameAsc: language === 'es' ? 'Alfabético' : 'Alphabetical',
    seasonAll: language === 'es' ? 'Todas las Temporadas' : 'All Seasons',
    seasonSS: language === 'es' ? 'Primavera / Verano' : 'Spring / Summer',
    seasonAW: language === 'es' ? 'Otoño / Invierno' : 'Autumn / Winter',
    emptyTitle: language === 'es' ? 'No se encontraron prendas' : 'No garments found',
    emptyDesc: language === 'es' ? 'Intenta cambiar tus filtros de búsqueda o categoría.' : 'Try adjusting your search query or category filters.',
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
      // Category filter
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

      // Season filter
      if (selectedSeason !== 'all') {
        if (item.season !== selectedSeason && item.season !== 'all-year') return false;
      }

      // Search query
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
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [garments, selectedCategory, selectedSeason, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* Page Header & Search - Matching screenshot exactly */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1b1c1b]">{t.title}</h2>
          <span className="font-mono text-xs text-[#43474c] bg-[#edf2f7] px-2.5 py-1 rounded border border-[#c4c6cc]">
            {filteredGarments.length} {t.itemsCount}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Search Bar matching screenshot */}
          <div className="relative w-full md:w-auto min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777c]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-[#fbf9f7] border border-[#c4c6cc] rounded focus:border-[#455565] focus:outline-none font-sans text-sm text-[#1b1c1b] transition-colors placeholder:text-[#74777c]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#74777c] hover:text-[#1b1c1b]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-[#ffffff] px-3 py-1.5 rounded border border-[#c4c6cc] shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#455565]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-mono text-xs text-[#1b1c1b] focus:outline-none cursor-pointer pr-1"
            >
              <option value="most-worn">{t.mostWorn}</option>
              <option value="least-worn">{t.leastWorn}</option>
              <option value="price-desc">{t.priceDesc}</option>
              <option value="name">{t.nameAsc}</option>
            </select>
          </div>
        </div>
      </header>

      {/* Filters Pills & Season selector - matching screenshot All, Tops, Bottoms, Shoes, Outerwear */}
      <section className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex flex-wrap gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 font-mono text-xs rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#735c00] text-white border border-[#735c00] font-semibold shadow-sm'
                    : 'bg-[#edf2f7] text-[#455565] border border-[#c4c6cc] hover:bg-[#efedec]'
                }`}
              >
                {cat.id === 'favorites' && <Heart className={`w-3 h-3 ${isActive ? 'fill-white' : ''}`} />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Season Filter Dropdown */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#43474c]">
          <Filter className="w-3.5 h-3.5 text-[#455565]" />
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value as any)}
            className="bg-[#edf2f7] border border-[#c4c6cc] rounded px-2.5 py-1 text-[#455565] focus:outline-none cursor-pointer"
          >
            <option value="all">{t.seasonAll}</option>
            <option value="spring-summer">{t.seasonSS}</option>
            <option value="autumn-winter">{t.seasonAW}</option>
          </select>
        </div>
      </section>

      {/* Garment Grid - 2 cols on mobile, 3 on md, 4 on lg */}
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
        <section className="fabric-grain bg-[#ffffff] border border-[#c4c6cc] rounded-xl p-12 text-center shadow-fabric my-8 max-w-lg mx-auto">
          <div className="w-12 h-12 bg-[#edf2f7] rounded-full flex items-center justify-center mx-auto mb-4 text-[#455565]">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#1b1c1b] mb-1">{t.emptyTitle}</h3>
          <p className="font-sans text-sm text-[#43474c] mb-6">{t.emptyDesc}</p>
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 bg-[#455565] hover:bg-[#394858] text-white rounded-lg font-sans text-sm font-semibold shadow-md inline-flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addNew}</span>
          </button>
        </section>
      )}
    </div>
  );
};
