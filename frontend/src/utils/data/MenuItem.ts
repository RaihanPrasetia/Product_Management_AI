// data/menuItems.ts
import {
  BiHome,
  BiShoppingBag,
  BiTag,
  BiClipboard,
  BiUser,
  BiSolidBox,
  BiDollar,
  BiSolidData,
} from 'react-icons/bi';
import { MenuItemType } from '../types/MenuTypes';

// Function to get menu items based on user role
export const getMenuItems = (): MenuItemType[] => {
  const userRole = localStorage.getItem('role');

  const baseMenuItems: MenuItemType[] = [
    { name: 'Dashboard', href: '/dashboard', icon: BiHome },
    { name: 'Product', href: '/product', icon: BiShoppingBag },
    {
      name: 'History',
      href: '/history',
      icon: BiClipboard,
      subMenu: [
        { name: 'Stock', href: '/stock', icon: BiSolidBox },
        { name: 'Purchase', href: '/purchase', icon: BiDollar },
      ],
    },
    {
      name: 'Master Data',
      href: '/master',
      icon: BiSolidData,
      subMenu: [
        { name: 'Category', href: '/category', icon: BiTag },
        { name: 'Variant', href: '/variant', icon: BiTag },
        { name: 'Brand', href: '/brand', icon: BiTag },
        { name: 'Supplier', href: '/supplier', icon: BiTag },
      ],
    },
  ];

  // Add User menu only for admin role
  if (userRole === 'ADMIN') {
    baseMenuItems.splice(2, 0, {
      name: 'User',
      href: '/user',
      icon: BiUser,
    });
  }

  return baseMenuItems;
};
