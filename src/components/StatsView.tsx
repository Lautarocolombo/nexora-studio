import React from 'react';
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
import { Award, TrendingUp, DollarSign, PieChart as PieIcon, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
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
  const totalItems = garments.length;
  const totalValue = garments.reduce((acc, g) => acc + (g.price || 0), 0);
  const totalWears = garments.reduce((acc, g) => acc + g.wornCount, 0);
  const avgWearsPerItem = totalItems > 0 ? Math.round(totalWears / totalItems) : 0;
  const overallCostPerWear = totalWears > 0 ? (totalValue / totalWears).toFixed(2) : '0.00';

  // Active items worn more than 10 times vs neglected
  const activeItems = garments.filter(g => g.wornCount >= 10).length;
  const utilizationRate = totalItems > 0 ? Math.round((activeItems / totalItems) * 100) : 0;

  // Category chart data
  const categories = ['tops', 'bottoms', 'shoes', 'outerwear', 'accessories'] as const;
  const categoryChartData = categories.map(cat => {
    const itemsInCat = garments.filter(g => g.category === cat);
    const count = itemsInCat.length;
    const wears = itemsInCat.reduce((acc, g) => acc + g.wornCount, 0);
    const label = cat === 'tops' ? (language === 'es' ? 'Tops' : 'Tops')
      : cat === 'bottoms' ? (language === 'es' ? 'Pantalones' : 'Bottoms')
      : cat === 'shoes' ? (language === 'es' ? 'Calzado' : 'Shoes')
      : cat === 'outerwear' ? (language === 'es' ? 'Abrigos' : 'Outerwear')
      : (language === 'es' ? 'Acc.' : 'Acc.');
    
    return { name: label, items: count, wears };
  }).filter(d => d.items > 0);

  // Pie chart data for Category Distribution
  const pieColors = ['#455565', '#d4ac0d', '#1b1c1b', '#74777c', '#b5c8e0'];

  // Leaderboards
  const sortedByCostPerWear = [...garments]
    .filter(g => g.price !== undefined && g.price > 0 && g.wornCount > 0)
    .sort((a, b) => (a.price! / a.wornCount) - (b.price! / b.wornCount));

  const topWorkhorses = sortedByCostPerWear.slice(0, 4);
  const neglectedItems = [...garments].sort((a, b) => a.wornCount - b.wornCount).slice(0, 4);

  const t = {
    title: language === 'es' ? 'Analítica de Guardarropa & Sostenibilidad' : 'Wardrobe Intelligence & Sustainability',
    subtitle: language === 'es' ? 'Audita tu verdadero costo por uso, tasa de utilización y rotación consciente.' : 'Audit your real cost per wear, utilization rate, and mindful rotation.',
    overview: language === 'es' ? 'Métricas Clave del Atelier' : 'Atelier Key Metrics',
    totalValue: language === 'es' ? 'Valor Total Invertido' : 'Total Wardrobe Value',
    avgCost: language === 'es' ? 'Costo/Uso General' : 'Overall Cost/Wear',
    totalWears: language === 'es' ? 'Total de Usos Registrados' : 'Total Logged Wears',
    utilization: language === 'es' ? 'Tasa de Utilización Activa' : 'Active Utilization Rate',
    workhorsesTitle: language === 'es' ? 'Inversiones Más Rentables (Costo/Uso Más Bajo)' : 'Best Return on Investment (Lowest Cost/Wear)',
    neglectedTitle: language === 'es' ? 'Prendas Olvidadas (Sugerencias de Rotación)' : 'Sleeping Garments (Rotation Reminders)',
    chartTitle: language === 'es' ? 'Distribución y Usos por Categoría' : 'Wears & Distribution by Category',
    equipBtn: language === 'es' ? 'Usar en Próximo Atuendo' : 'Equip in Next Outfit',
    wears: language === 'es' ? 'usos' : 'wears'
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <h2 className="font-serif text-3xl font-bold text-[#1b1c1b] tracking-tight">{t.title}</h2>
        <p className="font-sans text-sm text-[#43474c] mt-1">{t.subtitle}</p>
      </header>

      {/* Top Overview Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fabric-grain bg-[#ffffff] p-5 rounded-xl border border-[#c4c6cc] shadow-fabric">
          <span className="font-mono text-xs text-[#43474c] uppercase block flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#455565]" />
            {t.totalValue}
          </span>
          <span className="font-serif text-2xl md:text-3xl font-bold text-[#1b1c1b] mt-2 block">
            ${totalValue.toLocaleString()}
          </span>
          <span className="font-mono text-[11px] text-[#74777c] mt-1 block">
            {totalItems} {language === 'es' ? 'piezas catalogadas' : 'cataloged items'}
          </span>
        </div>

        <div className="fabric-grain bg-[#ffffff] p-5 rounded-xl border border-[#c4c6cc] shadow-fabric">
          <span className="font-mono text-xs text-[#43474c] uppercase block flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#735c00]" />
            {t.avgCost}
          </span>
          <span className="font-serif text-2xl md:text-3xl font-bold text-[#735c00] mt-2 block">
            ${overallCostPerWear}
          </span>
          <span className="font-mono text-[11px] text-[#74777c] mt-1 block">
            {language === 'es' ? 'meta sostenible < $15' : 'sustainability goal < $15'}
          </span>
        </div>

        <div className="fabric-grain bg-[#ffffff] p-5 rounded-xl border border-[#c4c6cc] shadow-fabric">
          <span className="font-mono text-xs text-[#43474c] uppercase block flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#455565]" />
            {t.totalWears}
          </span>
          <span className="font-serif text-2xl md:text-3xl font-bold text-[#455565] mt-2 block">
            {totalWears}
          </span>
          <span className="font-mono text-[11px] text-[#74777c] mt-1 block">
            ~{avgWearsPerItem} {language === 'es' ? 'usos por prenda' : 'wears per item'}
          </span>
        </div>

        <div className="fabric-grain bg-[#ffffff] p-5 rounded-xl border border-[#c4c6cc] shadow-fabric">
          <span className="font-mono text-xs text-[#43474c] uppercase block flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#735c00]" />
            {t.utilization}
          </span>
          <span className="font-serif text-2xl md:text-3xl font-bold text-[#1b1c1b] mt-2 block">
            {utilizationRate}%
          </span>
          <span className="font-mono text-[11px] text-[#74777c] mt-1 block">
            {activeItems} / {totalItems} {language === 'es' ? 'en rotación activa' : 'active workhorses'}
          </span>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bar Chart: Wears by Category (7 cols) */}
        <div className="lg:col-span-7 fabric-grain bg-[#ffffff] border border-[#c4c6cc] rounded-xl p-6 shadow-fabric">
          <h3 className="font-serif text-xl font-bold text-[#1b1c1b] mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#455565]" />
            <span>{t.chartTitle}</span>
          </h3>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#74777c" fontSize={12} tickLine={false} />
                <YAxis stroke="#74777c" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#c4c6cc', borderRadius: '8px', fontSize: '13px' }}
                />
                <Bar dataKey="wears" name={language === 'es' ? 'Usos Totales' : 'Total Wears'} fill="#455565" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Category Distribution (5 cols) */}
        <div className="lg:col-span-5 fabric-grain bg-[#ffffff] border border-[#c4c6cc] rounded-xl p-6 shadow-fabric flex flex-col justify-between">
          <h3 className="font-serif text-xl font-bold text-[#1b1c1b] mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-[#735c00]" />
            <span>{language === 'es' ? 'Composición del Guardarropa' : 'Wardrobe Composition'}</span>
          </h3>

          <div className="h-[220px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="items"
                >
                  {categoryChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#c4c6cc', borderRadius: '8px', fontSize: '13px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-4 border-t border-[#f5f3f1]">
            {categoryChartData.map((d, idx) => (
              <div key={d.name} className="flex items-center gap-1.5 font-mono text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
                <span className="text-[#43474c]">{d.name} ({d.items})</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Workhorse Heroes */}
        <div className="fabric-grain bg-[#ffffff] border border-[#c4c6cc] rounded-xl p-6 shadow-fabric">
          <h3 className="font-serif text-xl font-bold text-[#1b1c1b] mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#d4ac0d]" />
            <span>{t.workhorsesTitle}</span>
          </h3>

          <div className="space-y-4">
            {topWorkhorses.map((g, idx) => {
              const name = language === 'es' && g.nameEs ? g.nameEs : g.name;
              const cpw = (g.price! / g.wornCount).toFixed(2);
              return (
                <div key={g.id} className="flex items-center justify-between p-3 bg-[#f5f3f1] rounded-lg border border-[#e4e2e0]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold w-6 h-6 rounded-full bg-[#455565] text-white flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <img src={g.imageUrl} alt={name} className="w-11 h-12 rounded object-cover border border-[#c4c6cc]" />
                    <div>
                      <h4 className="font-sans text-sm font-semibold text-[#1b1c1b]">{name}</h4>
                      <span className="font-mono text-xs text-[#43474c]">{g.wornCount} {t.wears}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-lg font-bold text-[#735c00] block">${cpw}</span>
                    <span className="font-mono text-[10px] text-[#74777c]">/ use</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sleeping / Neglected Items */}
        <div className="fabric-grain bg-[#ffffff] border border-[#c4c6cc] rounded-xl p-6 shadow-fabric">
          <h3 className="font-serif text-xl font-bold text-[#1b1c1b] mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#455565]" />
            <span>{t.neglectedTitle}</span>
          </h3>

          <div className="space-y-4">
            {neglectedItems.map((g) => {
              const name = language === 'es' && g.nameEs ? g.nameEs : g.name;
              return (
                <div key={g.id} className="flex items-center justify-between p-3 bg-[#f5f3f1] rounded-lg border border-[#e4e2e0]">
                  <div className="flex items-center gap-3">
                    <img src={g.imageUrl} alt={name} className="w-11 h-12 rounded object-cover border border-[#c4c6cc]" />
                    <div>
                      <h4 className="font-sans text-sm font-semibold text-[#1b1c1b]">{name}</h4>
                      <span className="font-mono text-xs text-[#ba1a1a] font-medium">{g.wornCount} {t.wears}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSelectForBuilder(g);
                      onNavigateToBuilder();
                    }}
                    className="px-3 py-1.5 bg-[#455565] hover:bg-[#394858] text-white font-mono text-xs font-semibold rounded shadow-sm flex items-center gap-1 transition-transform active:scale-95"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{t.equipBtn}</span>
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
