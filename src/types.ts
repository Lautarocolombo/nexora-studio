export type GarmentCategory = 'all' | 'tops' | 'bottoms' | 'shoes' | 'outerwear' | 'accessories' | 'dresses' | 'formal';

export type SeasonTag = 'all-year' | 'spring-summer' | 'autumn-winter';

export interface GarmentItem {
  id: string;
  name: string;
  nameEs?: string;
  category: Exclude<GarmentCategory, 'all'>;
  categoryTag: string; // e.g. '[TOP]', '[BOTTOM]', '[SHOES]', '[OUTERWEAR]', '[ACCESSORY]', '[DRESS]'
  imageUrl: string;
  wornCount: number;
  lastWorn?: string; // YYYY-MM-DD
  material?: string;
  careInstructions?: string;
  careInstructionsEs?: string;
  brand?: string;
  season: SeasonTag;
  notes?: string;
  notesEs?: string;
  colorSwatch?: string; // hex color or description
  favorite?: boolean;
}

export interface OutfitItemSlot {
  top?: GarmentItem;
  bottom?: GarmentItem;
  shoes?: GarmentItem;
  outerwear?: GarmentItem;
  accessory?: GarmentItem;
}

export interface SavedOutfit {
  id: string;
  name: string;
  nameEs?: string;
  items: GarmentItem[];
  occasion?: string;
  occasionEs?: string;
  wornCount: number;
  lastWorn?: string;
  createdAt: string;
  harmonyScore?: number;
}

export interface WearLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  garmentIds: string[];
  outfitId?: string;
  outfitName?: string;
  notes?: string;
}

export type TabType = 'wardrobe' | 'builder' | 'calendar' | 'stats' | 'profile' | 'help';

export type Language = 'es' | 'en';