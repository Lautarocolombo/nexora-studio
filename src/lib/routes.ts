import { TabType } from '../types';

export const TAB_ROUTES: Record<TabType, string> = {
  wardrobe: '/',
  builder: '/builder',
  calendar: '/calendar',
  stats: '/stats',
  profile: '/profile',
  help: '/help',
  admin: '/admin',
  audit: '/audit',
};

export const ROUTE_TABS: Record<string, TabType> = Object.fromEntries(
  Object.entries(TAB_ROUTES).map(([tab, path]) => [path, tab as TabType])
) as Record<string, TabType>;

export function pathToTab(pathname: string): TabType {
  return ROUTE_TABS[pathname] ?? 'wardrobe';
}

export function tabToPath(tab: TabType): string {
  return TAB_ROUTES[tab] ?? '/';
}
