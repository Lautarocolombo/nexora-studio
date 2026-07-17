import React from 'react';
import { 
  Shirt, 
  Scissors, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Plus, 
  User, 
  HelpCircle, 
  Globe, 
  Bell, 
  Settings 
} from 'lucide-react';
import { TabType, Language } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onNewOutfitClick: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewOutfitClick,
  language,
  setLanguage
}) => {
  const t = {
    wardrobe: language === 'es' ? 'Guardarropa' : 'Wardrobe',
    builder: language === 'es' ? 'Constructor' : 'Builder',
    calendar: language === 'es' ? 'Calendario' : 'Calendar',
    stats: language === 'es' ? 'Estadísticas' : 'Stats',
    newOutfit: language === 'es' ? 'Nuevo Atuendo' : 'New Outfit',
    profile: language === 'es' ? 'Perfil' : 'Profile',
    help: language === 'es' ? 'Ayuda' : 'Help',
    tagline: language === 'es' ? 'El Guardarropa Consciente' : 'The Mindful Wardrobe'
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'wardrobe', label: t.wardrobe, icon: <Shirt className="w-5 h-5" /> },
    { id: 'builder', label: t.builder, icon: <Scissors className="w-5 h-5" /> },
    { id: 'calendar', label: t.calendar, icon: <CalendarIcon className="w-5 h-5" /> },
    { id: 'stats', label: t.stats, icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* TopNavBar Mobile Only */}
      <nav className="md:hidden flex justify-between items-center w-full px-4 py-3.5 bg-[#fbf9f7] border-b border-[#c4c6cc] fixed top-0 left-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold text-[#455565] tracking-tight">OutfitMatic</span>
          <span className="font-mono text-[10px] bg-[#edf2f7] text-[#455565] px-1.5 py-0.5 rounded font-medium">
            {language.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1 text-xs font-mono text-[#455565] bg-[#edf2f7] px-2 py-1 rounded border border-[#c4c6cc]"
            title="Cambiar idioma / Switch language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'ES' : 'EN'}</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className="p-1 text-[#43474c] hover:text-[#455565]"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* SideNavBar (Desktop) */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#fbf9f7] border-r border-[#c4c6cc] shadow-sm z-40 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-3xl font-bold text-[#455565] tracking-tight">OutfitMatic</h1>
            <button 
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1 text-[11px] font-mono text-[#455565] bg-[#edf2f7] hover:bg-[#e4e2e0] px-2 py-1 rounded border border-[#c4c6cc] transition-colors"
              title="Cambiar idioma / Switch language"
            >
              <Globe className="w-3 h-3" />
              <span>{language === 'es' ? 'ES' : 'EN'}</span>
            </button>
          </div>
          <p className="font-mono text-[11px] text-[#43474c] mt-1 tracking-wider uppercase">{t.tagline}</p>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${
                  isActive 
                    ? 'bg-[#5d6d7e] text-[#e2efff] shadow-sm translate-x-1 font-semibold' 
                    : 'text-[#43474c] hover:bg-[#efedec] hover:text-[#1b1c1b]'
                }`}
              >
                <span className={isActive ? 'text-[#ffffff]' : 'text-[#43474c]'}>
                  {item.icon}
                </span>
                <span className="font-mono text-xs tracking-wider uppercase">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* CTA Button */}
        <button 
          onClick={onNewOutfitClick}
          className="w-full bg-[#455565] text-white font-sans text-sm py-3.5 px-4 rounded-lg font-semibold shadow-md hover:bg-[#394858] transition-all flex items-center justify-center gap-2 mb-6 group active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>{t.newOutfit}</span>
        </button>

        {/* Footer Tabs */}
        <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-[#c4c6cc]">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-left ${
              activeTab === 'profile'
                ? 'bg-[#efedec] text-[#1b1c1b] font-medium'
                : 'text-[#43474c] hover:bg-[#efedec]'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="font-mono text-xs tracking-wider uppercase">{t.profile}</span>
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-left ${
              activeTab === 'help'
                ? 'bg-[#efedec] text-[#1b1c1b] font-medium'
                : 'text-[#43474c] hover:bg-[#efedec]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="font-mono text-xs tracking-wider uppercase">{t.help}</span>
          </button>
        </div>
      </aside>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden flex justify-around items-center w-full px-2 py-2.5 bg-[#fbf9f7] border-t border-[#c4c6cc] fixed bottom-0 left-0 z-50 shadow-lg">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 pb-1 transition-all flex-1 ${
                isActive ? 'text-[#455565] border-b-2 border-[#455565] font-bold' : 'text-[#43474c] opacity-80'
              }`}
            >
              {item.icon}
              <span className="font-mono text-[10px] tracking-tight uppercase truncate max-w-[65px]">
                {item.label}
              </span>
            </button>
          );
        })}
        <button
          onClick={onNewOutfitClick}
          className="flex flex-col items-center gap-1 pb-1 text-[#d4ac0d] flex-1 font-semibold"
        >
          <div className="bg-[#455565] text-white p-1 rounded-full shadow">
            <Plus className="w-4 h-4" />
          </div>
          <span className="font-mono text-[10px] tracking-tight uppercase">
            {language === 'es' ? 'Crear' : 'Add'}
          </span>
        </button>
      </nav>
    </>
  );
};
