import React, { useState, useEffect } from 'react';
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
import { WardrobeView } from './components/WardrobeView';
import { OutfitBuilder } from './components/OutfitBuilder';
import { CalendarView } from './components/CalendarView';
import { StatsView } from './components/StatsView';
import { ProfileView } from './components/ProfileView';
import { HelpView } from './components/HelpView';
import { GarmentDetailModal } from './components/GarmentDetailModal';
import { AddGarmentModal } from './components/AddGarmentModal';

const STORAGE_KEYS = {
  GARMENTS: 'outfitmatic_garments_v1',
  OUTFITS: 'outfitmatic_outfits_v1',
  LOGS: 'outfitmatic_logs_v1',
  LANG: 'outfitmatic_lang_v1'
};

export default function App() {
  // Load initial state from LocalStorage or fallback to INITIAL_GARMENTS
  const [garments, setGarments] = useState<GarmentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GARMENTS);
      return saved ? JSON.parse(saved) : INITIAL_GARMENTS;
    } catch {
      return INITIAL_GARMENTS;
    }
  });

  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OUTFITS);
      return saved ? JSON.parse(saved) : INITIAL_OUTFITS;
    } catch {
      return INITIAL_OUTFITS;
    }
  });

  const [wearLogs, setWearLogs] = useState<WearLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : INITIAL_WEAR_LOGS;
    } catch {
      return INITIAL_WEAR_LOGS;
    }
  });

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG) as Language;
      return saved === 'en' ? 'en' : 'es'; // Default to Spanish as requested ("Tu Guardarropa")
    } catch {
      return 'es';
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>('wardrobe');
  const [selectedGarmentForDetail, setSelectedGarmentForDetail] = useState<GarmentItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GARMENTS, JSON.stringify(garments));
    } catch (e) {
      console.error('Failed to save garments', e);
    }
  }, [garments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(savedOutfits));
    } catch (e) {
      console.error('Failed to save outfits', e);
    }
  }, [savedOutfits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(wearLogs));
    } catch (e) {
      console.error('Failed to save wearLogs', e);
    }
  }, [wearLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, language);
    } catch (e) {
      console.error('Failed to save lang', e);
    }
  }, [language]);

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
      items: o.items.filter(i => i.id !== garmentId)
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
    const outfitItemIds = outfit.items.map(i => i.id);

    // Increment outfit worn count
    setSavedOutfits(prev => prev.map(o => o.id === outfit.id ? { ...o, wornCount: o.wornCount + 1, lastWorn: today } : o));

    // Increment worn count for each item in the outfit
    setGarments(prev => prev.map(g => {
      if (outfitItemIds.includes(g.id)) {
        return {
          ...g,
          wornCount: g.wornCount + 1,
          lastWorn: today
        };
      }
      return g;
    }));

    // Add wear log
    const newLog: WearLogEntry = {
      id: `l-${Date.now()}`,
      date: today,
      garmentIds: outfitItemIds,
      outfitId: outfit.id,
      outfitName: language === 'es' && outfit.nameEs ? outfit.nameEs : outfit.name,
      notes: language === 'es' ? `Atuendo completo usado: ${outfit.nameEs || outfit.name}` : `Full outfit worn: ${outfit.name}`
    };
    setWearLogs(prev => [newLog, ...prev]);
  };

  const handleDeleteOutfit = (outfitId: string) => {
    setSavedOutfits(prev => prev.filter(o => o.id !== outfitId));
  };

  const handleLogCustomDate = (date: string, outfit?: SavedOutfit, garmentIds?: string[], notes?: string) => {
    const targetIds = outfit ? outfit.items.map(i => i.id) : (garmentIds || []);
    if (targetIds.length === 0 && !notes) return;

    // Increment worn count for those items
    if (targetIds.length > 0) {
      setGarments(prev => prev.map(g => {
        if (targetIds.includes(g.id)) {
          return {
            ...g,
            wornCount: g.wornCount + 1,
            lastWorn: date > (g.lastWorn || '') ? date : g.lastWorn
          };
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

  const handleResetToDemo = () => {
    setGarments(INITIAL_GARMENTS);
    setSavedOutfits(INITIAL_OUTFITS);
    setWearLogs(INITIAL_WEAR_LOGS);
    localStorage.removeItem(STORAGE_KEYS.GARMENTS);
    localStorage.removeItem(STORAGE_KEYS.OUTFITS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
  };

  return (
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
  );
}