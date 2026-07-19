import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HashRouter, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TabType, GarmentItem } from './types';
import { Navbar } from './components/Navbar';
import { AppRoutes } from './components/AppRoutes';
import { OnboardingTour } from './components/OnboardingTour';
import { GarmentDetailModal } from './components/GarmentDetailModal';
import { AddGarmentModal } from './components/AddGarmentModal';
import { AuthGuard } from './components/AuthGuard';
import { useAuth } from './lib/useAuth';
import { useWardrobeStore } from './hooks/useWardrobeStore';
import { useAppInit } from './hooks/useAppInit';
import { useOnboarding } from './hooks/useOnboarding';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAnalytics } from './hooks/useAnalytics';
import { useSeoMeta } from './hooks/useSeoMeta';
import { LanguageContext } from './hooks/LanguageContext';
import { UpdatePrompt } from './components/UpdatePrompt';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'sonner';
import { pathToTab, tabToPath } from './lib/routes';

function AppInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { seen, start } = useOnboarding();
  const { trackEvent } = useAnalytics();

  const store = useWardrobeStore();
  const activeTab = pathToTab(location.pathname);
  const [selectedGarmentForDetail, setSelectedGarmentForDetail] = useState<GarmentItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const setActiveTab = useCallback((tab: TabType) => navigate(tabToPath(tab)), [navigate]);

  useAppInit({
    setGarments: store.setGarments,
    setSavedOutfits: store.setSavedOutfits,
    setWearLogs: store.setWearLogs,
    setLanguage: store.setLanguage,
    setLoaded: store.setLoaded,
  });

  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(store.language);
  }, [store.language, i18n]);

  useSeoMeta(activeTab, store.language);

  useEffect(() => {
    trackEvent('tab_change', { tab: activeTab });
  }, [activeTab, trackEvent]);

  useEffect(() => {
    if (!seen && store.loaded) {
      const timer = setTimeout(() => start(), 800);
      return () => clearTimeout(timer);
    }
  }, [seen, store.loaded, start]);

  const shortcuts = useMemo(() => [
    { key: '/', handler: () => { const s = document.querySelector('input[type="text"]'); if (s) (s as HTMLInputElement).focus(); }, description: 'Focus search' },
    { key: 'n', handler: () => setIsAddModalOpen(true), description: 'New garment' },
    { key: 'b', handler: () => setActiveTab('builder'), description: 'Go to builder' },
    { key: 'w', handler: () => setActiveTab('wardrobe'), description: 'Go to wardrobe' },
    { key: 'c', handler: () => setActiveTab('calendar'), description: 'Go to calendar' },
    { key: 's', handler: () => setActiveTab('stats'), description: 'Go to stats' },
  ], [setActiveTab]);
  useKeyboardShortcuts(shortcuts);

  return (
    <LanguageContext.Provider value={{ language: store.language, setLanguage: store.setLanguage }}>
      <AuthGuard>
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: '#1B1814', border: '1px solid #2A2622', color: '#F7F3EC', fontFamily: 'var(--font-mono)', fontSize: '12px' },
            className: 'font-mono',
          }}
          theme="dark"
        />
        <div className="flex min-h-screen bg-[#0E0C0A] text-[#F7F3EC] font-sans selection:bg-[#C76B3F] selection:text-[#0B0A08]">
          <OnboardingTour />
          <Navbar
            onLogout={logout}
          />

          <main id="main-content" className="flex-1 ml-0 md:ml-64 pt-16 pb-20 md:pt-0 md:pb-0 min-h-screen transition-all">
            <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12 animate-fadeIn">
              <ErrorBoundary>
                <AppRoutes
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsAddModalOpen={setIsAddModalOpen}
                setSelectedGarmentForDetail={setSelectedGarmentForDetail}
                store={store}
              />
              </ErrorBoundary>
            </div>
          </main>

          <GarmentDetailModal
            garment={selectedGarmentForDetail}
            language={store.language}
            onClose={() => setSelectedGarmentForDetail(null)}
            onLogWear={(g) => store.handleLogWear(undefined, g)}
            onDelete={store.handleDeleteGarment}
            onUpdateNotes={store.handleUpdateNotes}
            onToggleFavorite={(id) => store.handleToggleFavorite(undefined, id)}
          />

          <AddGarmentModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddGarment={store.handleAddGarment}
          />

          <UpdatePrompt />
        </div>
      </AuthGuard>
    </LanguageContext.Provider>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppInner />
    </HashRouter>
  );
}
