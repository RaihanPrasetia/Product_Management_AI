// utils/sidebarUtils.ts

import { MenuItemType } from './types/MenuTypes';

/**
 * Checks if a menu item is active based on current pathname
 */
export function isMenuItemActive(
  item: MenuItemType,
  pathname: string
): boolean {
  const hasSubMenu = item.subMenu && item.subMenu.length > 0;

  return (
    pathname === item.href ||
    (hasSubMenu &&
      item.subMenu?.some((subItem) => pathname === subItem.href)) ||
    (item.href === '/customers' && pathname.startsWith('/customers')) ||
    (item.href === '/product' && pathname.startsWith('/product'))
  );
}
