import { GarmentCategory, SeasonTag } from '../../types';

export const CATEGORIES: { value: Exclude<GarmentCategory, 'all'>; i18nKey: string }[] = [
  { value: 'tops', i18nKey: 'admin.catTops' },
  { value: 'bottoms', i18nKey: 'admin.catBottoms' },
  { value: 'shoes', i18nKey: 'admin.catShoes' },
  { value: 'outerwear', i18nKey: 'admin.catOuterwear' },
  { value: 'accessories', i18nKey: 'admin.catAccessories' },
  { value: 'dresses', i18nKey: 'admin.catDresses' },
  { value: 'formal', i18nKey: 'admin.catFormal' },
];

export const SEASONS: { value: SeasonTag; i18nKey: string }[] = [
  { value: 'all-year', i18nKey: 'admin.seasonAllYear' },
  { value: 'spring-summer', i18nKey: 'admin.seasonSpringSummer' },
  { value: 'autumn-winter', i18nKey: 'admin.seasonAutumnWinter' },
];

export function getCategoryTag(cat: string): string {
  const map: Record<string, string> = {
    tops: '[TOP]', bottoms: '[BOTTOM]', shoes: '[SHOES]',
    outerwear: '[OUTERWEAR]', accessories: '[ACCESSORY]',
    dresses: '[DRESS]', formal: '[FORMAL]',
  };
  return map[cat] || '[ITEM]';
}
