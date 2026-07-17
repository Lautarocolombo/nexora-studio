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
    newOutfit: language === 'es' ? 'Nueva Prenda' : 'New Item',
    profile: language === 'es' ? 'Perfil' : 'Profile',
    help: language === 'es' ? 'Ayuda' : 'Help',
    tagline: language === 'es' ? 'Vidriera Editorial' : 'Editorial Closet'
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
      <nav className="md:hidden flex justify-between items-center w-full px-4 py-3.5 bg-[#161210] border-b border-[#2A2622] fixed top-0 left-0 z-50">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-[#C76B3F] tracking-tight">Nexora</span>
          <span className="font-mono text-[10px] bg-[#1B1814] text-[#C76B3F] px-1.5 py-0.5 rounded">
            {language.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1 text-xs font-mono text-[#C76B3F] bg-[#1B1814] px-2 py-1 rounded border border-[#2A2622]"
            title="Cambiar idioma / Switch language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'ES' : 'EN'}</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className="p-1 text-[#A89B8C] hover:text-[#C76B3F]"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* SideNavBar (Desktop) */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#0E0C0A] border-r border-[#2A2622] z-40 p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-3xl font-bold text-[#F7F3EC] tracking-tight">Nexora<span className="text-[#C76B3F]">.</span></h1>
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1 text-[11px] font-mono text-[#C76B3F] bg-[#1B1814] hover:bg-[#161210] px-2 py-1 rounded border border-[#2A2622] transition-colors"
              title="Cambiar idioma / Switch language"
            >
              <Globe className="w-3 h-3" />
              <span>{language === 'es' ? 'ES' : 'EN'}</span>
            </button>
          </div>
          <p className="font-mono text-[11px] text-[#A89B8C] mt-1 tracking-wider uppercase">{t.tagline}</p>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#1B1814] text-[#F7F3EC] shadow-sm translate-x-1 font-semibold border border-[#2A2622]'
                    : 'text-[#A89B8C] hover:bg-[#161210] hover:text-[#F7F3EC]'
                }`}
              >
                <span className={isActive ? 'text-[#C76B3F]' : 'text-[#A89B8C]'}>
                  {item.icon}
                </span>
                <span className="font-mono text-xs tracking-wider uppercase">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={onNewOutfitClick}
          className="w-full bg-[#C76B3F] text-[#0B0A08] font-sans text-sm py-3.5 px-4 rounded-lg font-semibold shadow-md hover:bg-[#b36138] transition-all flex items-center justify-center gap-2 mb-6 group active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>{t.newOutfit}</span>
        </button>

        <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-[#2A2622]">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-left ${
              activeTab === 'profile'
                ? 'bg-[#1B1814] text-[#F7F3EC] font-medium border border-[#2A2622]'
                : 'text-[#A89B8C] hover:bg-[#161210]'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="font-mono text-xs tracking-wider uppercase">{t.profile}</span>
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-left ${
              activeTab === 'help'
                ? 'bg-[#1B1814] text-[#F7F3EC] font-medium border border-[#2A2622]'
                : 'text-[#A89B8C] hover:bg-[#161210]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="font-mono text-xs tracking-wider uppercase">{t.help}</span>
          </button>
        </div>
      </aside>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden flex justify-around items-center w-full px-2 py-2.5 bg-[#0E0C0A] border-t border-[#2A2622] fixed bottom-0 left-0 z-50">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 pb-1 transition-all flex-1 ${
                isActive ? 'text-[#C76B3F] border-b-2 border-[#C76B3F] font-bold' : 'text-[#A89B8C] opacity-80'
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
          className="flex flex-col items-center gap-1 pb-1 text-[#C76B3F] flex-1 font-semibold"
        >
          <div className="bg-[#C76B3F] text-[#0B0A08] p-1 rounded-full shadow">
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