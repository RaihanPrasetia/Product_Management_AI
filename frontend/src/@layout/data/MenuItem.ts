// data/menuItems.ts
import {
  BiShoppingBag,
  BiTag,
  // BiUser,
  BiSolidBox,
  BiSolidDashboard,
  BiCalculator,
  BiCartAdd,
  BiDollarCircle,
  BiHistory,
  BiSitemap,
  BiBuildingHouse,
  BiSolidTruck,
  BiData,
} from 'react-icons/bi';
import { MenuItemType } from '../../types/MenuTypes';

// Function to get menu items based on user role
export const getMenuItems = (): MenuItemType[] => {
  // const userRole = localStorage.getItem('role');

  const baseMenuItems: MenuItemType[] = [
    { name: 'Dashboard', href: '/dashboard', icon: BiSolidDashboard },
    { name: 'Transaction', href: '/transaction', icon: BiCalculator },
    {
      name: 'History',
      href: '/history',
      icon: BiHistory,
      subMenu: [
        { name: 'Stock', href: '/stock', icon: BiSolidBox },
        { name: 'Purchase', href: '/purchase', icon: BiCartAdd },
        { name: 'Sale', href: '/sale', icon: BiDollarCircle },
      ],
    },
    {
      name: 'Master Data',
      href: '/master',
      icon: BiData,
      subMenu: [
        { name: 'Product', href: '/product', icon: BiShoppingBag },
        { name: 'Category', href: '/category', icon: BiTag },
        { name: 'Variant', href: '/variant', icon: BiSitemap },
        { name: 'Brand', href: '/brand', icon: BiBuildingHouse },
        { name: 'Supplier', href: '/supplier', icon: BiSolidTruck },
      ],
    },
  ];

  // Add User menu only for admin role
  // if (userRole === 'ADMIN') {
  //   baseMenuItems.splice(2, 0, {
  //     name: 'User',
  //     href: '/user',
  //     icon: BiUser,
  //   });
  // }

  return baseMenuItems;
};
