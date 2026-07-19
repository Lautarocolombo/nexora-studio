import React, { Suspense, lazy } from 'react';
import { GarmentItem, TabType } from '../types';
import { WardrobeStore } from '../hooks/useWardrobeStore';

const WardrobeView = lazy(() => import('./WardrobeView').then(m => ({ default: m.WardrobeView })));
const OutfitBuilder = lazy(() => import('./OutfitBuilder').then(m => ({ default: m.OutfitBuilder })));
const CalendarView = lazy(() => import('./CalendarView').then(m => ({ default: m.CalendarView })));
const StatsView = lazy(() => import('./StatsView').then(m => ({ default: m.StatsView })));
const ProfileView = lazy(() => import('./ProfileView').then(m => ({ default: m.ProfileView })));
const HelpView = lazy(() => import('./HelpView').then(m => ({ default: m.HelpView })));
const AdminPanel = lazy(() => import('./AdminPanel').then(m => ({ default: m.AdminPanel })));
const AuditView = lazy(() => import('./AuditView').then(m => ({ default: m.AuditView })));

function ViewFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]" role="status" aria-live="polite">
      <div className="space-y-4 w-full max-w-md">
        <div className="h-8 bg-[#1B1814] rounded-lg animate-shimmer w-3/4" />
        <div className="h-4 bg-[#1B1814] rounded animate-shimmer w-1/2" />
        <div className="grid grid-cols-2 gap-4 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-[#1B1814] rounded-xl animate-shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}

interface AppRoutesProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  setIsAddModalOpen: (v: boolean) => void;
  setSelectedGarmentForDetail: (g: GarmentItem | null) => void;
  store: WardrobeStore;
}

export function AppRoutes({ activeTab, setActiveTab, setIsAddModalOpen, setSelectedGarmentForDetail, store }: AppRoutesProps) {
  const { garments, savedOutfits, wearLogs, language,
    handleLogWear, handleToggleFavorite, handleDeleteGarment,
    handleAddGarment, handleUpdateGarment, handleSaveOutfit, handleLogOutfitWear,
    handleDeleteOutfit, handleLogCustomDate, handleResetToDemo, handleImportData,
  } = store;

  return (
    <Suspense fallback={<ViewFallback />}>
      <div key={activeTab} className="animate-page-enter">
      {activeTab === 'wardrobe' && (
        <WardrobeView
          garments={garments}
          language={language}
          onCardClick={(g) => setSelectedGarmentForDetail(g)}
          onLogWear={handleLogWear}
          onToggleFavorite={handleToggleFavorite}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      )}

      {activeTab === 'builder' && (
        <OutfitBuilder
          garments={garments}
          savedOutfits={savedOutfits}
          onSaveOutfit={handleSaveOutfit}
          onLogOutfitWear={handleLogOutfitWear}
          onDeleteOutfit={handleDeleteOutfit}
          language={language}
        />
      )}

      {activeTab === 'calendar' && (
        <CalendarView
          wearLogs={wearLogs}
          garments={garments}
          savedOutfits={savedOutfits}
          onLogCustomDate={handleLogCustomDate}
          language={language}
        />
      )}

      {activeTab === 'stats' && (
        <StatsView
          garments={garments}
          language={language}
          onSelectForBuilder={() => setActiveTab('builder')}
          onNavigateToBuilder={() => setActiveTab('builder')}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileView
          garments={garments}
          savedOutfits={savedOutfits}
          language={language}
          setLanguage={store.setLanguage}
          onResetToDemo={handleResetToDemo}
          onImportData={handleImportData}
        />
      )}

      {activeTab === 'help' && (
        <HelpView />
      )}

      {activeTab === 'admin' && (
        <AdminPanel
          garments={garments}
          onUpdateGarment={handleUpdateGarment}
          onDeleteGarment={handleDeleteGarment}
          onAddGarment={handleAddGarment}
          language={language}
        />
      )}

      {activeTab === 'audit' && (
        <AuditView />
      )}
      </div>
    </Suspense>
  );
}
