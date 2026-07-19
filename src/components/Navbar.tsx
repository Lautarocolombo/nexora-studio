import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  Shirt,
  Scissors,
  Calendar as CalendarIcon,
  BarChart3,
  Plus,
  User,
  HelpCircle,
  Globe,
  Settings,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { TabType } from '../types';
import { tabToPath } from '../lib/routes';

interface NavbarProps {
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLogout
}) => {
  const { t, i18n } = useTranslation();

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'wardrobe', label: t('nav.wardrobe'), icon: <Shirt className="w-5 h-5" /> },
    { id: 'builder', label: t('nav.builder'), icon: <Scissors className="w-5 h-5" /> },
    { id: 'calendar', label: t('nav.calendar'), icon: <CalendarIcon className="w-5 h-5" /> },
    { id: 'stats', label: t('nav.stats'), icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'admin', label: t('nav.admin'), icon: <Settings className="w-5 h-5" /> },
    { id: 'audit', label: t('nav.audit'), icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${
      isActive
        ? 'bg-[#1B1814] text-[#F7F3EC] shadow-sm translate-x-1 font-semibold border border-[#2A2622]'
        : 'text-[#A89B8C] hover:bg-[#161210] hover:text-[#F7F3EC]'
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 pb-1 transition-all flex-1 ${
      isActive ? 'text-[#C76B3F] border-b-2 border-[#C76B3F] font-bold' : 'text-[#A89B8C] opacity-80'
    }`;

  const bottomLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-left ${
      isActive
        ? 'bg-[#1B1814] text-[#F7F3EC] font-medium border border-[#2A2622]'
        : 'text-[#A89B8C] hover:bg-[#161210]'
    }`;

  return (
    <>
      {/* TopNavBar Mobile Only */}
      <nav className="md:hidden flex justify-between items-center w-full px-4 py-3.5 bg-[#161210] border-b border-[#2A2622] fixed top-0 left-0 z-50" aria-label={t('nav.mainNav')}>
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-[#C76B3F] tracking-tight" aria-hidden="true">Armario<span className="text-[#C76B3F]">.</span></span>
          <span className="font-mono text-xs bg-[#1B1814] text-[#C76B3F] px-1.5 py-0.5 rounded">
            {i18n.language.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')}
            aria-label={t('nav.switchLang')}
            className="flex items-center gap-1 text-xs font-mono text-[#C76B3F] bg-[#1B1814] px-2 py-1 rounded border border-[#2A2622]"
            title={t('nav.langSwitchTitle')}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{i18n.language === 'es' ? 'ES' : 'EN'}</span>
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              aria-label={t('nav.logout')}
              className="p-1 text-[#A89B8C] hover:text-[#E0795A]"
              title={t('nav.logoutTitle')}
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
          <NavLink
            to={tabToPath('profile')}
            aria-label={t('nav.profileAria')}
            className="p-1 text-[#A89B8C] hover:text-[#C76B3F]"
          >
            <Settings className="w-5 h-5" />
          </NavLink>
        </div>
      </nav>

      {/* SideNavBar (Desktop) */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#0E0C0A] border-r border-[#2A2622] z-40 p-6" aria-label={t('nav.sidebar')}>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-3xl font-bold text-[#F7F3EC] tracking-tight">Armario<span className="text-[#C76B3F]">.</span></h1>
            <button
              onClick={() => i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')}
              aria-label={t('nav.switchLang')}
              className="flex items-center gap-1 text-xs font-mono text-[#C76B3F] bg-[#1B1814] hover:bg-[#161210] px-2 py-1 rounded border border-[#2A2622] transition-colors"
              title={t('nav.langSwitchTitle')}
            >
              <Globe className="w-3 h-3" />
              <span>{i18n.language === 'es' ? 'ES' : 'EN'}</span>
            </button>
          </div>
          <p className="font-mono text-xs text-[#A89B8C] mt-1 tracking-wider uppercase">{t('nav.tagline')}</p>
        </div>

        <nav className="flex-1 flex flex-col gap-2" aria-label={t('nav.viewNav')}>
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={tabToPath(item.id)}
              className={linkClass}
              data-onboarding={item.id === 'wardrobe' ? 'nav-wardrobe' : item.id === 'builder' ? 'nav-builder' : undefined}
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-[#C76B3F]' : 'text-[#A89B8C]'}>
                    {item.icon}
                  </span>
                  <span className="font-mono text-xs tracking-wider uppercase">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to={tabToPath('builder')}
          data-onboarding="add-garment"
          className="w-full bg-[#C76B3F] text-[#0B0A08] font-sans text-sm py-3.5 px-4 rounded-lg font-semibold shadow-md hover:bg-[#b36138] transition-all flex items-center justify-center gap-2 mb-6 group animate-press"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>{t('nav.newOutfit')}</span>
        </NavLink>

        <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-[#2A2622]">
          <NavLink
            to={tabToPath('profile')}
            aria-label={t('nav.profileAria')}
            className={bottomLinkClass}
          >
            <User className="w-4 h-4" />
            <span className="font-mono text-xs tracking-wider uppercase">{t('nav.profile')}</span>
          </NavLink>
          <NavLink
            to={tabToPath('help')}
            aria-label={t('nav.helpAria')}
            className={bottomLinkClass}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="font-mono text-xs tracking-wider uppercase">{t('nav.help')}</span>
          </NavLink>
          {onLogout && (
            <button
              onClick={onLogout}
              aria-label={t('nav.logout')}
              className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-left text-[#A89B8C] hover:bg-[#161210] hover:text-[#E0795A]"
              title={t('nav.logoutTitle')}
            >
              <LogOut className="w-4 h-4" />
              <span className="font-mono text-xs tracking-wider uppercase">
                {t('nav.logoutLabel')}
              </span>
            </button>
          )}
        </div>
      </aside>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden flex justify-around items-center w-full px-2 py-2.5 bg-[#0E0C0A] border-t border-[#2A2622] fixed bottom-0 left-0 z-50" aria-label={t('nav.bottomNav')}>
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={tabToPath(item.id)}
            className={mobileLinkClass}
          >
            {item.icon}
            <span className="font-mono text-xs tracking-tight uppercase truncate max-w-[65px]">
              {item.label}
            </span>
          </NavLink>
        ))}
        <NavLink
          to={tabToPath('builder')}
          className="flex flex-col items-center gap-1 pb-1 text-[#C76B3F] flex-1 font-semibold"
          aria-label={t('nav.openBuilder')}
        >
          <div className="bg-[#C76B3F] text-[#0B0A08] p-1 rounded-full shadow">
            <Scissors className="w-4 h-4" />
          </div>
          <span className="font-mono text-xs tracking-tight uppercase">
            {t('nav.create')}
          </span>
        </NavLink>
      </nav>
    </>
  );
};
