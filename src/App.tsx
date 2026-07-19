import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  GarmentItem,
  SavedOutfit,
  WearLogEntry,
  TabType,
  Language
} from './types';
import {
  INITIAL_GARMENTS,
  INITIAL_OUTFITS,
  INITIAL_WEAR_LOGS
} from './data/initialWardrobe';
import { Navbar } from './components/Navbar';
import { GarmentDetailModal } from './components/GarmentDetailModal';
import { AddGarmentModal } from './components/AddGarmentModal';
import { AuthGuard } from './components/AuthGuard';
import { useAuth } from './lib/auth';
import { db } from './lib/db';
import { useWardrobeSync, useOutfitsSync, useWearLogsSync, useLanguageSync } from './hooks/useSync';

// PERFORMANCE: Code-splitting por vista. Cada vista se carga bajo demanda
// (React.lazy + Suspense), reduciendo el bundle inicial y mejorando TTI/Lighthouse.
const WardrobeView = lazy(() => import('./components/WardrobeView').then(m => ({ default: m.WardrobeView })));
const OutfitBuilder = lazy(() => import('./components/OutfitBuilder').then(m => ({ default: m.OutfitBuilder })));
const CalendarView = lazy(() => import('./components/CalendarView').then(m => ({ default: m.CalendarView })));
const StatsView = lazy(() => import('./components/StatsView').then(m => ({ default: m.StatsView })));
const ProfileView = lazy(() => import('./components/ProfileView').then(m => ({ default: m.ProfileView })));
const HelpView = lazy(() => import('./components/HelpView').then(m => ({ default: m.HelpView })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const AuditView = lazy(() => import('./components/AuditView').then(m => ({ default: m.AuditView })));


function ViewFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]" role="status" aria-live="polite">
      <span className="w-6 h-6 border-2 border-[#C76B3F]/30 border-t-[#C76B3F] rounded-full animate-spin" />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}

const STORAGE_KEYS = {
  GARMENTS: 'outfitmatic_garments_v2',
  OUTFITS: 'outfitmatic_outfits_v2',
  LOGS: 'outfitmatic_logs_v2',
  LANG: 'outfitmatic_lang_v2'
};

export default function App() {
  const { logout } = useAuth();

  const [garments, setGarments] = useState<GarmentItem[]>(INITIAL_GARMENTS);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>(INITIAL_OUTFITS);
  const [wearLogs, setWearLogs] = useState<WearLogEntry[]>(INITIAL_WEAR_LOGS);
  const [language, setLanguage] = useState<Language>('es');
  const [activeTab, setActiveTab] = useState<TabType>('wardrobe');
  const [selectedGarmentForDetail, setSelectedGarmentForDetail] = useState<GarmentItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Migrate old localStorage v1 -> v2 on mount
  useEffect(() => {
    ['outfitmatic_garments_v1','outfitmatic_outfits_v1','outfitmatic_logs_v1','outfitmatic_lang_v1'].forEach(key => localStorage.removeItem(key));
  }, []);

  // Load from IndexedDB on mount
  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const [savedGarments, savedOutfits, savedLogs, savedLang] = await Promise.all([
          db.getAll('garments'),
          db.getAll('outfits'),
          db.getAll('logs'),
          db.get('lang', 'language')
        ]);

        if (cancelled) return;

        if (savedGarments.length > 0) {
          setGarments(savedGarments as GarmentItem[]);
        } else {
          await db.putAll('garments', INITIAL_GARMENTS);
          setGarments(INITIAL_GARMENTS);
        }

        if (savedOutfits.length > 0) {
          const normalized = (savedOutfits as any[]).map((o: any) => {
            if (Array.isArray(o.items) && !Array.isArray(o.garmentIds)) {
              return { ...o, garmentIds: o.items.map((i: any) => i.id) };
            }
            return o;
          });
          setSavedOutfits(normalized as SavedOutfit[]);
        } else {
          await db.putAll('outfits', INITIAL_OUTFITS);
          setSavedOutfits(INITIAL_OUTFITS);
        }

        if (savedLogs.length > 0) {
          setWearLogs(savedLogs as WearLogEntry[]);
        } else {
          await db.putAll('logs', INITIAL_WEAR_LOGS);
          setWearLogs(INITIAL_WEAR_LOGS);
        }

        if (savedLang) {
          setLanguage(savedLang.value === 'en' ? 'en' : 'es');
        } else {
          await db.put('lang', { key: 'language', value: 'es' });
          setLanguage('es');
        }
      } catch (e) {
        console.error('Failed to load data from IndexedDB', e);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, []);

  useWardrobeSync(garments, setGarments, loaded);
  useOutfitsSync(savedOutfits, setSavedOutfits, loaded);
  useWearLogsSync(wearLogs, setWearLogs, loaded);
  useLanguageSync(language, setLanguage, loaded);

  // Handlers
  const handleLogWear = (e: React.MouseEvent | undefined, garment: GarmentItem) => {
    if (e) e.stopPropagation();
    const today = new Date().toISOString().split('T')[0];

    // Update garment worn count
    setGarments(prev => prev.map(g => {
      if (g.id === garment.id) {
        return {
          ...g,
          wornCount: g.wornCount + 1,
          lastWorn: today
        };
      }
      return g;
    }));

    // Update modal item if open
    if (selectedGarmentForDetail && selectedGarmentForDetail.id === garment.id) {
      setSelectedGarmentForDetail(prev => prev ? ({
        ...prev,
        wornCount: prev.wornCount + 1,
        lastWorn: today
      }) : null);
    }

    // Add log entry
    const newLog: WearLogEntry = {
      id: `l-${Date.now()}`,
      date: today,
      garmentIds: [garment.id],
      notes: language === 'es' ? `Uso individual registrado: ${garment.nameEs || garment.name}` : `Single wear logged: ${garment.name}`
    };
    setWearLogs(prev => [newLog, ...prev]);
  };

  const handleToggleFavorite = (e: React.MouseEvent | undefined, garmentId: string) => {
    if (e) e.stopPropagation();
    setGarments(prev => prev.map(g => {
      if (g.id === garmentId) {
        const nextFav = !g.favorite;
        if (selectedGarmentForDetail && selectedGarmentForDetail.id === garmentId) {
          setSelectedGarmentForDetail({ ...g, favorite: nextFav });
        }
        return { ...g, favorite: nextFav };
      }
      return g;
    }));
  };

  const handleDeleteGarment = (garmentId: string) => {
    setGarments(prev => prev.filter(g => g.id !== garmentId));
    setSavedOutfits(prev => prev.map(o => ({
      ...o,
      garmentIds: o.garmentIds.filter(id => id !== garmentId)
    })));
  };

  const handleUpdateNotes = (garmentId: string, newNotes: string) => {
    setGarments(prev => prev.map(g => {
      if (g.id === garmentId) {
        const updated = language === 'es' ? { ...g, notesEs: newNotes, notes: newNotes } : { ...g, notes: newNotes };
        if (selectedGarmentForDetail && selectedGarmentForDetail.id === garmentId) {
          setSelectedGarmentForDetail(updated);
        }
        return updated;
      }
      return g;
    }));
  };

  const handleAddGarment = (newGarmentData: Omit<GarmentItem, 'id'>) => {
    const newGarment: GarmentItem = {
      ...newGarmentData,
      id: `g-${Date.now()}`
    };
    setGarments(prev => [newGarment, ...prev]);
  };

  const resolveOutfitItems = (outfit: SavedOutfit) => {
    return outfit.garmentIds
      .map(id => garments.find(g => g.id === id))
      .filter((g): g is GarmentItem => !!g);
  };

  const handleSaveOutfit = (outfitData: Omit<SavedOutfit, 'id' | 'createdAt'>) => {
    const newOutfit: SavedOutfit = {
      ...outfitData,
      id: `o-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSavedOutfits(prev => [newOutfit, ...prev]);
  };

  const handleLogOutfitWear = (outfit: SavedOutfit) => {
    const today = new Date().toISOString().split('T')[0];
    const outfitItems = resolveOutfitItems(outfit);
    const outfitItemIds = outfitItems.map(i => i.id);

    if (outfitItemIds.length === 0) return;

    setSavedOutfits(prev => prev.map(o => o.id === outfit.id ? { ...o, wornCount: o.wornCount + 1, lastWorn: today } : o));

    setGarments(prev => prev.map(g => {
      if (outfitItemIds.includes(g.id)) {
        return { ...g, wornCount: g.wornCount + 1, lastWorn: today };
      }
      return g;
    }));

    const newLog: WearLogEntry = {
      id: `l-${Date.now()}`,
      date: today,
      garmentIds: outfitItemIds,
      outfitId: outfit.id,
      outfitName: language === 'es' && outfit.nameEs ? outfit.nameEs : outfit.name,
      notes: language === 'es' ? `Conjunto usado: ${outfit.nameEs || outfit.name}` : `Outfit worn: ${outfit.name}`
    };
    setWearLogs(prev => [newLog, ...prev]);
  };

  const handleDeleteOutfit = (outfitId: string) => {
    setSavedOutfits(prev => prev.filter(o => o.id !== outfitId));
  };

  const handleLogCustomDate = (date: string, outfit?: SavedOutfit, garmentIds?: string[], notes?: string) => {
    let targetIds: string[] = [];
    if (outfit) {
      targetIds = resolveOutfitItems(outfit).map(i => i.id);
    } else if (garmentIds) {
      targetIds = garmentIds;
    }
    if (targetIds.length === 0 && !notes) return;

    if (targetIds.length > 0) {
      setGarments(prev => prev.map(g => {
        if (targetIds.includes(g.id)) {
          return { ...g, wornCount: g.wornCount + 1, lastWorn: date > (g.lastWorn || '') ? date : g.lastWorn };
        }
        return g;
      }));
    }

    if (outfit) {
      setSavedOutfits(prev => prev.map(o => o.id === outfit.id ? { ...o, wornCount: o.wornCount + 1, lastWorn: date } : o));
    }

    const newLog: WearLogEntry = {
      id: `l-${Date.now()}`,
      date,
      garmentIds: targetIds,
      outfitId: outfit?.id,
      outfitName: outfit ? (language === 'es' && outfit.nameEs ? outfit.nameEs : outfit.name) : undefined,
      notes
    };
    setWearLogs(prev => [newLog, ...prev]);
  };

  const handleResetToDemo = async () => {
    setGarments(INITIAL_GARMENTS);
    setSavedOutfits(INITIAL_OUTFITS);
    setWearLogs(INITIAL_WEAR_LOGS);
    await Promise.all([
      db.clear('garments'),
      db.clear('outfits'),
      db.clear('logs'),
      db.clear('lang')
    ]);
    await db.putAll('garments', INITIAL_GARMENTS);
    await db.putAll('outfits', INITIAL_OUTFITS);
    await db.putAll('logs', INITIAL_WEAR_LOGS);
    await db.put('lang', { key: 'language', value: 'es' });
    setLanguage('es');
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  };

  const handleUpdateGarment = (id: string, data: Partial<GarmentItem>) => {
    setGarments(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#0E0C0A] text-[#F7F3EC] font-sans selection:bg-[#C76B3F] selection:text-[#0B0A08]">
        {/* Navigation Bars */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNewOutfitClick={() => {
            // Open new garment or builder depending on preference
            setIsAddModalOpen(true);
          }}
          language={language}
          setLanguage={setLanguage}
          onLogout={logout}
        />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 pt-16 pb-20 md:pt-0 md:pb-0 min-h-screen transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12 animate-fadeIn">
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
              onSelectForBuilder={(g) => {
                setActiveTab('builder');
              }}
              onNavigateToBuilder={() => setActiveTab('builder')}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              garments={garments}
              savedOutfits={savedOutfits}
              language={language}
              setLanguage={setLanguage}
              onResetToDemo={handleResetToDemo}
            />
          )}

          {activeTab === 'help' && (
            <HelpView language={language} />
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
            <Suspense fallback={<ViewFallback />}>
              <AuditView />
            </Suspense>
          )}
        </div>
      </main>


      {/* Modals */}
      <GarmentDetailModal
        garment={selectedGarmentForDetail}
        language={language}
        onClose={() => setSelectedGarmentForDetail(null)}
        onLogWear={(g) => handleLogWear(undefined, g)}
        onDelete={handleDeleteGarment}
        onUpdateNotes={handleUpdateNotes}
        onToggleFavorite={(id) => handleToggleFavorite(undefined, id)}
      />

      <AddGarmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGarment={handleAddGarment}
        language={language}
      />
      </div>
    </AuthGuard>
  );
}