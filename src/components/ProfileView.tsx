import React, { useState } from 'react';
import { User, Award, ShieldCheck, Download, Upload, Globe, Check, SlidersHorizontal, Sparkles } from 'lucide-react';
import { GarmentItem, SavedOutfit, Language } from '../types';

interface ProfileViewProps {
  garments: GarmentItem[];
  savedOutfits: SavedOutfit[];
  language: Language;
  setLanguage: (lang: Language) => void;
  onResetToDemo: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  garments,
  savedOutfits,
  language,
  setLanguage,
  onResetToDemo
}) => {
  const [capsuleGoal, setCapsuleGoal] = useState('33');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ garments, savedOutfits }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `outfitmatic_wardrobe_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const t = {
    title: language === 'es' ? 'Perfil del Atelier & Objetivos Conscientes' : 'Atelier Profile & Mindful Goals',
    subtitle: language === 'es' ? 'Configura tus metas del Proyecto 333, respaldos y preferencias.' : 'Configure your Project 333 targets, backups, and preferences.',
    profileCard: language === 'es' ? 'Curador del Guardarropa' : 'Wardrobe Curator',
    role: language === 'es' ? 'Esteta Consciente (Miembro desde 2026)' : 'Mindful Aesthete (Member since 2026)',
    capsuleTitle: language === 'es' ? 'Meta de Cápsula Minimalista (Proyecto 333)' : 'Minimalist Capsule Target (Project 333)',
    capsuleDesc: language === 'es' ? 'El reto de vestir con 33 prendas o menos durante 3 meses.' : 'The challenge to dress with 33 items or fewer for 3 months.',
    currentProgress: language === 'es' ? 'Progreso Actual:' : 'Current Progress:',
    itemsOf: language === 'es' ? 'piezas de' : 'items of',
    languageSection: language === 'es' ? 'Idioma de la Interfaz / Language' : 'Interface Language',
    backupSection: language === 'es' ? 'Respaldo de Datos & Exportación' : 'Data Backup & Export',
    exportBtn: language === 'es' ? 'Exportar Guardarropa (JSON)' : 'Export Wardrobe (JSON)',
    resetBtn: language === 'es' ? 'Restablecer Datos de Demostración' : 'Reset Demo Wardrobe',
    saveBtn: language === 'es' ? 'Guardar Preferencias' : 'Save Preferences',
    savedMsg: language === 'es' ? '¡Preferencias actualizadas!' : 'Preferences saved!'
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <header>
        <h2 className="font-display text-3xl font-bold text-[#F7F3EC] tracking-tight">{t.title}</h2>
        <p className="font-sans text-sm text-[#A89B8C] mt-1">{t.subtitle}</p>
      </header>

      <section className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-6 shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 bg-[#C76B3F] rounded-full flex items-center justify-center text-white shadow-md">
          <User className="w-10 h-10" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <h3 className="font-display text-2xl font-bold text-[#F7F3EC]">Lautaro C.</h3>
            <span className="font-mono text-[11px] bg-[#161210] text-[#C76B3F] px-2.5 py-0.5 rounded font-semibold border border-[#2A2622]">PRO ATELIER</span>
          </div>
          <p className="font-mono text-xs text-[#A89B8C] mt-1">{t.role}</p>
          <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
            <span className="font-mono text-xs text-[#C76B3F] font-bold bg-[#161210] px-2.5 py-1 rounded border border-[#2A2622] flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>{garments.length} {language === 'es' ? 'Piezas catalogadas' : 'Garments logged'}</span>
            </span>
            <span className="font-mono text-xs text-[#A89B8C] font-bold bg-[#161210] px-2.5 py-1 rounded border border-[#2A2622] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{savedOutfits.length} {language === 'es' ? 'Atuendos curados' : 'Curated Outfits'}</span>
            </span>
          </div>
        </div>
      </section>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        <section className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-6 shadow-2xl space-y-4">
          <h3 className="font-display text-xl font-bold text-[#F7F3EC] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C76B3F]" />
            <span>{t.capsuleTitle}</span>
          </h3>
          <p className="font-sans text-sm text-[#A89B8C]">{t.capsuleDesc}</p>

          <div className="pt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-xs font-semibold text-[#A89B8C]">{t.currentProgress}</span>
              <span className="font-mono text-xs font-bold text-[#F7F3EC]">{garments.length} {t.itemsOf} {capsuleGoal}</span>
            </div>
            <div className="w-full bg-[#161210] rounded-full h-3 overflow-hidden border border-[#2A2622]">
              <div className="h-full transition-all duration-500 bg-[#C76B3F]" style={{ width: `${Math.min(100, (garments.length / Math.max(1, parseInt(capsuleGoal))) * 100)}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#2A2622]">
            <div>
              <label className="block font-mono text-xs text-[#A89B8C] uppercase mb-1">{language === 'es' ? 'Límite de Prendas por Cápsula' : 'Capsule Garment Limit'}</label>
              <select value={capsuleGoal} onChange={(e) => setCapsuleGoal(e.target.value)} className="w-full bg-[#161210] border border-[#2A2622] focus:border-[#C76B3F] rounded px-3 py-2 text-sm text-[#F7F3EC] focus:outline-none">
                <option value="25">25 {language === 'es' ? 'prendas' : 'items'} (Ultra Minimal)</option>
                <option value="33">33 {language === 'es' ? 'prendas' : 'items'} (Project 333 Classic)</option>
                <option value="50">50 {language === 'es' ? 'prendas' : 'items'} (Balanced Capsule)</option>
                <option value="100">100 {language === 'es' ? 'prendas' : 'items'} (Full Wardrobe)</option>
              </select>
            </div>
          </div>
        </section>

        <section className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-6 shadow-2xl space-y-4">
          <h3 className="font-display text-xl font-bold text-[#F7F3EC] flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#C76B3F]" />
            <span>{t.languageSection}</span>
          </h3>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            <button type="button" onClick={() => setLanguage('es')} className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between font-mono text-sm font-semibold ${language === 'es' ? 'border-[#C76B3F] bg-[#161210] text-[#C76B3F]' : 'border-[#2A2622] text-[#A89B8C] hover:border-[#C76B3F]'}`}>
              <span>Español (ES)</span>
              {language === 'es' && <Check className="w-4 h-4" />}
            </button>

            <button type="button" onClick={() => setLanguage('en')} className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between font-mono text-sm font-semibold ${language === 'en' ? 'border-[#C76B3F] bg-[#161210] text-[#C76B3F]' : 'border-[#2A2622] text-[#A89B8C] hover:border-[#C76B3F]'}`}>
              <span>English (EN)</span>
              {language === 'en' && <Check className="w-4 h-4" />}
            </button>
          </div>
        </section>

        <section className="fabric-grain bg-[#1B1814] border border-[#2A2622] rounded-xl p-6 shadow-2xl space-y-4">
          <h3 className="font-display text-xl font-bold text-[#F7F3EC] flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#C76B3F]" />
            <span>{t.backupSection}</span>
          </h3>

          <div className="flex flex-wrap gap-4 pt-2">
            <button type="button" onClick={handleExport} className="px-4 py-2.5 bg-[#161210] hover:bg-[#0E0C0A] text-[#A89B8C] border border-[#2A2622] rounded-lg font-mono text-xs font-semibold flex items-center gap-2 transition-all shadow-sm">
              <Download className="w-4 h-4" />
              <span>{t.exportBtn}</span>
            </button>

            <button type="button" onClick={() => { if (confirm(language === 'es' ? '¿Restablecer al guardarropa de demostración?' : 'Reset to initial demo wardrobe?')) { onResetToDemo(); } }} className="px-4 py-2.5 bg-[#161210] hover:bg-[#C76B3F]/10 text-[#C76B3F] border border-[#2A2622] rounded-lg font-mono text-xs font-semibold flex items-center gap-2 transition-all">
              <span>{t.resetBtn}</span>
            </button>
          </div>
        </section>

        <div className="flex justify-end items-center gap-4 pt-4">
          {isSaved && <span className="font-mono text-xs text-[#C76B3F] font-bold flex items-center gap-1 animate-fadeIn"><Check className="w-4 h-4" /><span>{t.savedMsg}</span></span>}
          <button type="submit" className="px-6 py-3 bg-[#C76B3F] hover:bg-[#A85A32] text-white rounded-lg font-sans text-sm font-semibold shadow-md transition-all active:scale-95">
            {t.saveBtn}
          </button>
        </div>
      </form>
    </div>
  );
};
