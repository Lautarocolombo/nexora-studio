import { GarmentItem, SavedOutfit, WearLogEntry } from '../types';

const img = (id: string) => `/garments/${id}.jpg`;

const NAMES_TOPS = ['Camisa de Lino', 'Remera de Algodón', 'Polera Cuello Alto', 'Blusa de Seda', 'Camisa Oxford', 'Top Estructurado', 'Camisa Fluid', 'Muscle Tee'];
const NAMES_BOTTOMS = ['Vaqueros Selvedge', 'Pantalón de Lana', 'Chino Tapered', 'Jogger Técnico', 'Pantalón Ancho', 'Jeans Negros', 'Bermuda Lino', 'Falda Lápiz'];
const NAMES_SHOES = ['Zapatilla Minimal', 'Botín de Cuero', 'Mocasín Clásico', 'Zapato Derby', 'Sandalia Cuña', 'Sneaker Retro', 'Boot Trabajo', 'Loafer Negro'];
const NAMES_OUTER = ['Blazer Estructurado', 'Trench Beige', 'Campera Cuero', 'Cardigan Lana', 'Chaleco Lana', 'Sobretodo Gris', 'Jean Jacket', 'Parka Verde'];
const NAMES_ACC = ['Bufanda Cashmere', 'Cinturón Cuero', 'Gorro Lana', 'Anteojos Sol', 'Bolso Tote', 'Pañuelo Seda', 'Reloj Acero', 'Guantes Piel'];

type Spec = { cat: GarmentItem['category']; tag: string; list: string[] };

const SPECS: Spec[] = [
  { cat: 'tops', tag: '[TOP]', list: NAMES_TOPS },
  { cat: 'bottoms', tag: '[BOTTOM]', list: NAMES_BOTTOMS },
  { cat: 'shoes', tag: '[SHOES]', list: NAMES_SHOES },
  { cat: 'outerwear', tag: '[OUTERWEAR]', list: NAMES_OUTER },
  { cat: 'accessories', tag: '[ACCESSORY]', list: NAMES_ACC },
];

const SEASONS: GarmentItem['season'][] = ['all-year', 'spring-summer', 'autumn-winter'];
const SWATCHES = ['#C76B3F', '#1C1A17', '#3D4F3B', '#F7F3EC', '#b36138', '#2b2b2b', '#6b5b4f', '#a89b8c'];

const files = [
  '04429f40-0b66-42a3-a2ec-673770eb545b', '06c91424-2724-4736-928b-520e5efcca05',
  '08cf9a82-6d42-4444-8445-cdffa9d3c2de', '0dfb4d96-d967-4ed5-ba7a-c119f6ef04e7',
  '1977d375-b1b1-429f-99eb-7d7a2f3b67d9', '359fd4b4-7e43-4104-ae97-afacd2405fda',
  '3bbd807e-e4c0-49df-b133-be5a073a2727', '49b9a7dd-88b1-4c2c-ad61-524411191806',
  '55023528-b388-4f01-b88d-3965a47618d6', '56b87c5d-3ae6-49dc-a719-33adbd664e68',
  '57ee7f79-34c7-4680-baa3-3ee3eeb18878', '711d3443-ae9a-4eda-ace4-36b2480fb0b9',
  '7238f4b2-561a-4937-af11-d32e83c3a623', '80452279-e6f6-4509-984d-48fcdec9ee67',
  '89abf0f6-6274-40ed-9550-1745f3bf04ee', '9bc6f1d2-9859-4b50-b318-a526978cc197',
  'a14bd567-da64-4261-a388-78b803b7bc13', 'a4efeadb-fac0-417c-8fc8-8c6efa519185',
  'b0761f5c-50ab-4a7c-b96f-a8b5f6155e40', 'b63dc38f-96a7-4fd5-9a23-f20d516a4706',
  'c470e8c5-9bda-4ab0-8f9d-5cf64c249dea', 'd02dafaf-ec62-4c78-aba9-3285e5660bed',
  'd8ba1489-f798-49f3-ac04-bb8308344855', 'de141be7-0356-403f-ac29-13851712eb28',
  'e9b716d1-79b2-47c2-9496-82636c8348b1', 'efaf2d3e-9d47-4b17-b4eb-f6675e401596',
  'f35d4a46-53c4-481c-8cbb-4ab8144e1e71',
];

const INITIAL_GARMENTS: GarmentItem[] = files.map((id, i) => {
  const spec = SPECS[i % SPECS.length];
  const name = spec.list[Math.floor(i / SPECS.length)] || `${spec.tag.replace(/[[\]]/g, '')} ${i + 1}`;
  const season = SEASONS[i % SEASONS.length];
  return {
    id: `g-${i + 1}`,
    name,
    nameEs: name,
    category: spec.cat,
    categoryTag: spec.tag,
    imageUrl: img(id),
    wornCount: Math.floor(Math.random() * 40) + 2,
    lastWorn: `2026-0${1 + (i % 6)}-${10 + (i % 18)}`,
    material: 'Mezcla premium / Composición seleccionada',
    careInstructions: 'Seguir etiqueta del fabricante. Lavar en frío.',
    careInstructionsEs: 'Seguir etiqueta del fabricante. Lavar en frío.',
    season,
    notes: 'Pieza de la colección editorial Armario.',
    notesEs: 'Pieza de la colección editorial Armario.',
    colorSwatch: SWATCHES[i % SWATCHES.length],
    favorite: i % 4 === 0,
  };
});

const byCat = (cat: GarmentItem['category']) => INITIAL_GARMENTS.filter((g) => g.category === cat);

const INITIAL_OUTFITS: SavedOutfit[] = [
  {
    id: 'o-1',
    name: 'Editorial Diario',
    nameEs: 'Editorial Diario',
    garmentIds: [byCat('tops')[0].id, byCat('bottoms')[0].id, byCat('shoes')[0].id],
    occasion: 'Everyday / Street',
    occasionEs: 'Día a día',
    wornCount: 9,
    lastWorn: '2026-07-02',
    createdAt: '2026-05-10',
    harmonyScore: 96
  },
  {
    id: 'o-2',
    name: 'Ciudad Otoñal',
    nameEs: 'Ciudad Otoñal',
    garmentIds: [byCat('tops')[1].id, byCat('bottoms')[1].id, byCat('shoes')[1].id, byCat('outerwear')[0].id],
    occasion: 'Smart Casual',
    occasionEs: 'Casual Elegante',
    wornCount: 6,
    lastWorn: '2026-06-20',
    createdAt: '2026-03-15',
    harmonyScore: 92
  },
  {
    id: 'o-3',
    name: 'Look Completo',
    nameEs: 'Look Completo',
    garmentIds: [byCat('tops')[2].id, byCat('bottoms')[2].id, byCat('shoes')[2].id, byCat('accessories')[0].id],
    occasion: 'Editorial',
    occasionEs: 'Editorial',
    wornCount: 7,
    lastWorn: '2026-06-25',
    createdAt: '2026-04-02',
    harmonyScore: 94
  }
];

const INITIAL_WEAR_LOGS: WearLogEntry[] = [
  { id: 'l-1', date: '2026-07-02', garmentIds: [INITIAL_GARMENTS[1].id, INITIAL_GARMENTS[8].id, INITIAL_GARMENTS[15].id], notes: 'Salida de estudio.' },
  { id: 'l-2', date: '2026-07-01', garmentIds: [INITIAL_GARMENTS[0].id, INITIAL_GARMENTS[1].id, INITIAL_GARMENTS[2].id], outfitId: 'o-1', outfitName: 'Editorial Diario', notes: 'Café con amigos.' },
  { id: 'l-3', date: '2026-06-28', garmentIds: [INITIAL_GARMENTS[8].id, INITIAL_GARMENTS[5].id, INITIAL_GARMENTS[15].id], notes: 'Tarde de reuniones.' },
  { id: 'l-4', date: '2026-06-25', garmentIds: [INITIAL_GARMENTS[8].id, INITIAL_GARMENTS[4].id, INITIAL_GARMENTS[15].id, INITIAL_GARMENTS[20].id], outfitId: 'o-3', outfitName: 'Look Completo' },
  { id: 'l-5', date: '2026-06-20', garmentIds: [INITIAL_GARMENTS[0].id, INITIAL_GARMENTS[5].id, INITIAL_GARMENTS[15].id], notes: 'Cena al aire libre.' }
];

export { INITIAL_GARMENTS, INITIAL_OUTFITS, INITIAL_WEAR_LOGS };
