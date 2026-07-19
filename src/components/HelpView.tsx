import React from 'react';
import { HelpCircle, BookOpen, ShieldAlert, Sparkles, Heart, Check, Shirt, Layers } from 'lucide-react';
import { Language } from '../types';

interface HelpViewProps {
  language: Language;
}

export const HelpView: React.FC<HelpViewProps> = ({ language }) => {
  const t = {
    title: language === 'es' ? 'Filosofía & Guía de Cuidado Textil' : 'Philosophy & Fabric Care Guide',
    subtitle: language === 'es' ? 'Aprendé a armar conjuntos, calcular uso y cuidar tus prendas.' : 'Learn to build outfits, calculate wear, and care for your garments.',
    philosophyTitle: language === 'es' ? '¿Qué es el Guardarropa Consciente?' : 'What is The Mindful Wardrobe?',
    philosophyP1: language === 'es'
      ? 'Armario Studio se aleja de la moda rápida y vertiginosa hacia una experiencia organizada y funcional. El objetivo es combinar las prendas que ya tenés, registrando sus usos para descubrir tu estilo personal y reducir el descarte.'
      : 'Armario Studio moves away from fast, disposable fashion toward an organized, functional experience. The goal is to combine pieces you already own, tracking wears to discover your personal style and reduce waste.',
    cpwTitle: language === 'es' ? 'El Índice de Uso por Prenda' : 'Wear Index Per Garment',
    cpwDesc: language === 'es'
      ? 'Cada vez que te ponés una prenda, sumás un uso. Las piezas más usadas son las verdaderas estrellas de tu armario. Las poco usadas te invitan a probar combinaciones nuevas.'
      : 'Every time you wear a garment, you log a wear. The most worn pieces are your wardrobe stars. The least worn invite you to try new combinations.',
    careTitle: language === 'es' ? 'Guía de Cuidado Textil' : 'Fabric Care Guide',
    fabrics: [
      {
        name: language === 'es' ? 'Lino Orgánico (Linen)' : 'Organic Linen',
        care: language === 'es' ? 'Lavar a mano o ciclo delicado en agua fría. Secar colgado a la sombra. No usar secadora.' : 'Hand wash or delicate cycle in cold water. Line dry in shade. Never tumble dry.'
      },
      {
        name: language === 'es' ? 'Vaqueros Selvedge (Raw Denim)' : 'Raw & Selvedge Denim',
        care: language === 'es' ? 'Ventilar tras cada uso. Lavar del revés en agua fría como máximo cada 6 meses para preservar el color.' : 'Air out after wear. Wash inside out in cold bath at most every 6 months to preserve color.'
      },
      {
        name: language === 'es' ? 'Lana Merino & Cachemira (Wool/Cashmere)' : 'Merino Wool & Cashmere',
        care: language === 'es' ? 'Lavar a mano con champú de lana. Secar siempre extendido en horizontal sobre una toalla.' : 'Hand wash with wool wash. Always dry flat on a clean towel.'
      },
      {
        name: language === 'es' ? 'Calzado de Cuero (Italian Leather)' : 'Calfskin Leather Footwear',
        care: language === 'es' ? 'Limpiar con microfibra húmeda tras cada uso. Hidratar con bálsamo de cuero mensualmente.' : 'Wipe clean with damp microfiber after wear. Condition monthly with leather balsam.'
      }
    ]
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <header>
        <h2 className="font-display text-3xl font-bold text-[#F7F3EC] tracking-tight">{t.title}</h2>
        <p className="font-sans text-sm text-[#A89B8C] mt-1">{t.subtitle}</p>
      </header>

      <section className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-6 shadow-2xl space-y-4">
        <h3 className="font-display text-xl font-bold text-[#F7F3EC] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#C76B3F]" />
          <span>{t.philosophyTitle}</span>
        </h3>
        <p className="font-sans text-base text-[#A89B8C] leading-relaxed">{t.philosophyP1}</p>
      </section>

      <section className="fabric-grain bg-[#161210] border border-[#C76B3F] rounded-xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-[#C76B3F] flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <span>{t.cpwTitle}</span>
          </h3>
          <span className="font-mono text-xs font-bold bg-[#1B1814] text-[#C76B3F] px-2.5 py-1 rounded border border-[#2A2622]">Usos = Estilo</span>
        </div>
        <p className="font-sans text-sm text-[#F7F3EC] leading-relaxed">{t.cpwDesc}</p>
      </section>

      <section className="space-y-6">
        <h3 className="font-display text-2xl font-bold text-[#F7F3EC] flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-[#C76B3F]" />
          <span>{t.careTitle}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.fabrics.map((f, idx) => (
            <div key={idx} className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-5 shadow-2xl flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-[#C76B3F] font-bold uppercase tracking-wider block mb-1">[FABRIC SPEC #{idx + 1}]</span>
                <h4 className="font-display text-lg font-bold text-[#F7F3EC] mb-2">{f.name}</h4>
                <p className="font-sans text-xs text-[#A89B8C] leading-relaxed pl-3 border-l-2 border-[#C76B3F]/40 py-0.5">{f.care}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};