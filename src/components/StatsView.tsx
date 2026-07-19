import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Award, TrendingUp, PieChart as PieIcon, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GarmentItem, Language } from '../types';

interface StatsViewProps {
  garments: GarmentItem[];
  language: Language;
  onSelectForBuilder: (garment: GarmentItem) => void;
  onNavigateToBuilder: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  garments,
  language,
  onSelectForBuilder,
  onNavigateToBuilder
}) => {
  const { t } = useTranslation();
  const totalItems = garments.length;
  const totalWears = garments.reduce((acc, g) => acc + g.wornCount, 0);
  const avgWearsPerItem = totalItems > 0 ? Math.round(totalWears / totalItems) : 0;
  const activeItems = garments.filter(g => g.wornCount >= 10).length;
  const utilizationRate = totalItems > 0 ? Math.round((activeItems / totalItems) * 100) : 0;

  const categoryChartData = useMemo(() => {
    const cats = ['tops', 'bottoms', 'shoes', 'outerwear', 'accessories'] as const;
    return cats.map(cat => {
    const itemsInCat = garments.filter(g => g.category === cat);
    const count = itemsInCat.length;
    const wears = itemsInCat.reduce((acc, g) => acc + g.wornCount, 0);
    const label = cat === 'tops' ? t('stats.catTops')
      : cat === 'bottoms' ? t('stats.catBottoms')
      : cat === 'shoes' ? t('stats.catShoes')
      : cat === 'outerwear' ? t('stats.catOuterwear')
      : t('stats.catAcc');
    return { name: label, items: count, wears };
    }).filter(d => d.items > 0);
  }, [garments, t]);

  const pieColors = ['#C76B3F', '#A89B8C', '#6B6358', '#2A2622', '#455565'];

  const topWorn = useMemo(() => [...garments].sort((a, b) => b.wornCount - a.wornCount).slice(0, 4), [garments]);
  const neglectedItems = useMemo(() => [...garments].sort((a, b) => a.wornCount - b.wornCount).slice(0, 4), [garments]);

  return (
    <div className="space-y-10">
      <header>
        <h2 className="font-display text-3xl font-bold text-[#F7F3EC] tracking-tight">{t('stats.title')}</h2>
        <p className="font-sans text-sm text-[#A89B8C] mt-1">{t('stats.subtitle')}</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fabric-grain bg-[#1B1814] p-5 rounded-xl border border-[#2A2622] shadow-2xl">
          <span className="font-mono text-xs text-[#A89B8C] uppercase block flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#C76B3F]" />
            {t('stats.totalItems')}
          </span>
          <span className="font-display text-2xl md:text-3xl font-bold text-[#F7F3EC] mt-2 block">{totalItems}</span>
          <span className="font-mono text-xs text-[#A89B8C] mt-1 block">{t('stats.piecesInWardrobe')}</span>
        </div>

        <div className="fabric-grain bg-[#1B1814] p-5 rounded-xl border border-[#2A2622] shadow-2xl">
          <span className="font-mono text-xs text-[#A89B8C] uppercase block flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#C76B3F]" />
            {t('stats.totalWears')}
          </span>
          <span className="font-display text-2xl md:text-3xl font-bold text-[#C76B3F] mt-2 block">{totalWears}</span>
          <span className="font-mono text-xs text-[#A89B8C] mt-1 block">{t('stats.wearLogs')}</span>
        </div>

        <div className="fabric-grain bg-[#1B1814] p-5 rounded-xl border border-[#2A2622] shadow-2xl">
          <span className="font-mono text-xs text-[#A89B8C] uppercase block flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#C76B3F]" />
            {t('stats.avgWears')}
          </span>
          <span className="font-display text-2xl md:text-3xl font-bold text-[#F7F3EC] mt-2 block">{avgWearsPerItem}</span>
          <span className="font-mono text-xs text-[#A89B8C] mt-1 block">{t('stats.perPiece')}</span>
        </div>

        <div className="fabric-grain bg-[#1B1814] p-5 rounded-xl border border-[#2A2622] shadow-2xl">
          <span className="font-mono text-xs text-[#A89B8C] uppercase block flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C76B3F]" />
            {t('stats.utilization')}
          </span>
          <span className="font-display text-2xl md:text-3xl font-bold text-[#C76B3F] mt-2 block">{utilizationRate}%</span>
          <span className="font-mono text-xs text-[#A89B8C] mt-1 block">{activeItems} / {totalItems} {t('stats.activeRotation')}</span>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-6 shadow-2xl">
          <h3 className="font-display text-xl font-bold text-[#F7F3EC] mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#C76B3F]" />
            <span>{t('stats.chartTitle')}</span>
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#A89B8C" fontSize={12} tickLine={false} />
                <YAxis stroke="#A89B8C" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1B1814', borderColor: '#2A2622', borderRadius: '8px', fontSize: '13px', color: '#F7F3EC' }} />
                <Bar dataKey="wears" name={t('stats.barName')} fill="#C76B3F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-6 shadow-2xl flex flex-col justify-between">
          <h3 className="font-display text-xl font-bold text-[#F7F3EC] mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-[#C76B3F]" />
            <span>{t('stats.composition')}</span>
          </h3>

          <div className="h-[220px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="items">
                  {categoryChartData.map((_, index) => <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1B1814', borderColor: '#2A2622', borderRadius: '8px', fontSize: '13px', color: '#F7F3EC' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-4 border-t border-[#2A2622]">
            {categoryChartData.map((d, idx) => (
              <div key={d.name} className="flex items-center gap-1.5 font-mono text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
                <span className="text-[#A89B8C]">{d.name} ({d.items})</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-6 shadow-2xl">
          <h3 className="font-display text-xl font-bold text-[#F7F3EC] mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#C76B3F]" />
            <span>{t('stats.topWornTitle')}</span>
          </h3>

          <div className="space-y-4">
            {topWorn.map((g, idx) => {
              const name = language === 'es' && g.nameEs ? g.nameEs : g.name;
              return (
                <div key={g.id} className="flex items-center justify-between p-3 bg-[#161210] rounded-lg border border-[#2A2622]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold w-6 h-6 rounded-full bg-[#C76B3F] text-white flex items-center justify-center">#{idx + 1}</span>
                    <img src={g.imageUrl} alt={name} className="w-11 h-12 rounded object-cover border border-[#2A2622]" />
                    <div>
                      <h4 className="font-sans text-sm font-semibold text-[#F7F3EC]">{name}</h4>
                      <span className="font-mono text-xs text-[#A89B8C]">{g.wornCount} {t('stats.wears')}</span>
                    </div>
                  </div>
                  <button onClick={() => { onSelectForBuilder(g); onNavigateToBuilder(); }} className="px-3 py-1.5 bg-[#C76B3F] hover:bg-[#A85A32] text-white font-mono text-xs font-semibold rounded shadow-sm flex items-center gap-1 transition-transform active:scale-95">
                    <RefreshCw className="w-3 h-3" />
                    <span>{t('stats.equipBtn')}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-6 shadow-2xl">
          <h3 className="font-display text-xl font-bold text-[#F7F3EC] mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#C76B3F]" />
            <span>{t('stats.neglectedTitle')}</span>
          </h3>

          <div className="space-y-4">
            {neglectedItems.map((g) => {
              const name = language === 'es' && g.nameEs ? g.nameEs : g.name;
              return (
                <div key={g.id} className="flex items-center justify-between p-3 bg-[#161210] rounded-lg border border-[#2A2622]">
                  <div className="flex items-center gap-3">
                    <img src={g.imageUrl} alt={name} className="w-11 h-12 rounded object-cover border border-[#2A2622]" />
                    <div>
                      <h4 className="font-sans text-sm font-semibold text-[#F7F3EC]">{name}</h4>
                      <span className="font-mono text-xs text-[#A89B8C] font-medium">{g.wornCount} {t('stats.wears')}</span>
                    </div>
                  </div>
                  <button onClick={() => { onSelectForBuilder(g); onNavigateToBuilder(); }} className="px-3 py-1.5 bg-[#C76B3F] hover:bg-[#A85A32] text-white font-mono text-xs font-semibold rounded shadow-sm flex items-center gap-1 transition-transform active:scale-95">
                    <RefreshCw className="w-3 h-3" />
                    <span>{t('stats.equipBtn')}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
