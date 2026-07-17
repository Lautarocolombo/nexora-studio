import React from 'react';
import { HelpCircle, BookOpen, ShieldAlert, Sparkles, Heart, Check, Shirt, Layers } from 'lucide-react';
import { Language } from '../types';

interface HelpViewProps {
  language: Language;
}

export const HelpView: React.FC<HelpViewProps> = ({ language }) => {
  const t = {
    title: language === 'es' ? 'Filosofía & Guía de Cuidado Textil' : 'Philosophy & Fabric Care Guide',
    subtitle: language === 'es' ? 'Aprende sobre el Guardarropa Consciente, cálculo de costo por uso y mantenimiento textil.' : 'Learn about The Mindful Wardrobe, cost per wear calculation, and textile maintenance.',
    philosophyTitle: language === 'es' ? '¿Qué es el Guardarropa Consciente?' : 'What is The Mindful Wardrobe?',
    philosophyP1: language === 'es'
      ? 'OutfitMatic se aleja de la estética fría y vertiginosa de la moda rápida hacia una experiencia táctil, organizada y funcional. Nos enfocamos en curar menos prendas de mayor calidad que ames y uses durante años.'
      : 'OutfitMatic moves away from cold, fast-fashion trends toward a tactile, organized, and functional experience. We focus on curating fewer, higher-quality garments that you love and wear for years.',
    cpwTitle: language === 'es' ? 'El Cálculo de Costo por Uso (Cost Per Wear)' : 'The Cost Per Wear Formula (CPW)',
    cpwDesc: language === 'es'
      ? 'El costo real de una prenda no es su etiqueta en la tienda, sino su precio dividido entre la cantidad de veces que la vistes. Un abrigo de $450 usado 90 veces cuesta solo $5.00 por uso—una inversión mucho más rentable e inteligente.'
      : 'The true cost of a garment is not its retail tag, but its price divided by the number of times worn. A $450 coat worn 90 times costs only $5.00 per wear—a much smarter, more sustainable investment.',
    careTitle: language === 'es' ? 'Guía Sastrería de Mantenimiento por Fibra' : 'Tailor Fabric Maintenance Guide',
    fabrics: [
      {
        name: language === 'es' ? 'Lino Orgánico (Linen)' : 'Organic Linen',
        care: language === 'es' ? 'Lavar a mano o ciclo delicado en agua fría. Secar colgado a la sombra para proteger las fibras naturales. No usar secadora.' : 'Hand wash or delicate cycle in cold water. Line dry in shade to protect natural fibers. Never tumble dry.'
      },
      {
        name: language === 'es' ? 'Vaqueros Selvedge (Raw Denim)' : 'Raw & Selvedge Denim',
        care: language === 'es' ? 'Ventilar tras cada uso. Lavar del revés en agua fría como máximo cada 6 meses o cuando sea indispensable para desarrollar un desgaste personalizado y evitar pérdida celular de índigo.' : 'Air out after wear. Wash inside out in cold bath at most every 6 months to preserve indigo whiskers and custom fades.'
      },
      {
        name: language === 'es' ? 'Lana Merino & Cachemira (Wool/Cashmere)' : 'Merino Wool & Cashmere',
        care: language === 'es' ? 'Lavar a mano con champú de lana o jabón neutro. Secar siempre extendido en horizontal sobre una toalla para evitar que la prenda pierda su silueta o se estire.' : 'Hand wash with wool wash or mild baby shampoo. Always dry flat on a clean towel to prevent stretching or misshaping.'
      },
      {
        name: language === 'es' ? 'Calzado de Cuero (Italian Leather)' : 'Calfskin Leather Footwear',
        care: language === 'es' ? 'Limpiar el polvo y suciedad con microfibra húmeda o cepillo de crin tras su uso. Hidratar con bálsamo de cuero mensualmente para prevenir grietas y mantener la flexibilidad.' : 'Wipe clean with damp microfiber or horsehair brush after wear. Condition monthly with leather balsam to prevent cracking.'
      }
    ]
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <header>
        <h2 className="font-serif text-3xl font-bold text-[#1b1c1b] tracking-tight">{t.title}</h2>
        <p className="font-sans text-sm text-[#43474c] mt-1">{t.subtitle}</p>
      </header>

      {/* Philosophy Section */}
      <section className="fabric-grain bg-[#ffffff] border border-[#c4c6cc] rounded-xl p-6 shadow-fabric space-y-4">
        <h3 className="font-serif text-xl font-bold text-[#1b1c1b] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#735c00]" />
          <span>{t.philosophyTitle}</span>
        </h3>
        <p className="font-sans text-base text-[#43474c] leading-relaxed">
          {t.philosophyP1}
        </p>
      </section>

      {/* Cost per Wear Formula Box */}
      <section className="fabric-grain bg-[#fbf9f7] border border-[#455565] rounded-xl p-6 shadow-fabric space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#455565] flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <span>{t.cpwTitle}</span>
          </h3>
          <span className="font-mono text-xs font-bold bg-[#edf2f7] text-[#455565] px-2.5 py-1 rounded">
            CPW = Price / Wears
          </span>
        </div>
        <p className="font-sans text-sm text-[#1b1c1b] leading-relaxed">
          {t.cpwDesc}
        </p>
      </section>

      {/* Fabric Care Guide */}
      <section className="space-y-6">
        <h3 className="font-serif text-2xl font-bold text-[#1b1c1b] flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-[#735c00]" />
          <span>{t.careTitle}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.fabrics.map((f, idx) => (
            <div 
              key={idx} 
              className="fabric-grain bg-[#ffffff] border border-[#c4c6cc] rounded-xl p-5 shadow-fabric flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[11px] text-[#455565] font-bold uppercase tracking-wider block mb-1">
                  [FABRIC SPEC #{idx + 1}]
                </span>
                <h4 className="font-serif text-lg font-bold text-[#1b1c1b] mb-2">{f.name}</h4>
                <p className="font-sans text-xs text-[#43474c] leading-relaxed pl-3 border-l-2 border-[#455565]/40 py-0.5">
                  {f.care}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
