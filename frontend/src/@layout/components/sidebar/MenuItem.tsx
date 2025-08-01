// components/MenuItem.tsx
import { NavigateFunction } from 'react-router-dom';
import { BiChevronDown } from 'react-icons/bi';
import { MenuItemType } from '@/types/MenuTypes';
import SubMenuItem from './SubMenuItem';

// 1. Impor library yang dibutuhkan
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

type MenuItemProps = {
  item: MenuItemType;
  pathname: string;
  isOpen: boolean;
  activeDropdown: string | null;
  toggleDropdown: (name: string) => void;
  navigate: NavigateFunction;
};

export default function MenuItem({
  item,
  pathname,
  isOpen,
  activeDropdown,
  toggleDropdown,
  navigate,
}: MenuItemProps) {
  const hasSubMenu = item.subMenu && item.subMenu.length > 0;
  const isActive =
    pathname.startsWith(item.href) ||
    (hasSubMenu && item.subMenu?.some((sub) => pathname.startsWith(sub.href)));
  const isDropdownOpen = activeDropdown === item.name;

  return (
    <li>
      <button
        onClick={() =>
          hasSubMenu ? toggleDropdown(item.name) : navigate(item.href)
        }
        // 2. Gunakan `clsx` untuk merapikan class names
        className={clsx(
          'hover:cursor-pointer flex items-center w-full px-3 py-2 space-x-3 rounded-xl text-sm font-semibold transition-colors duration-200',
          {
            'bg-purple-100 text-purple-700 shadow-sm': isActive,
            'hover:bg-gray-100 text-gray-700': !isActive,
          }
        )}
      >
        <div
          className={clsx('p-2 rounded-full transition-all duration-300', {
            'text-white bg-gradient-to-br from-pink-500 to-purple-700 shadow-lg':
              isActive,
            'bg-white text-gray-700 border border-gray-200': !isActive,
          })}
        >
          <item.icon className="w-5 h-5" />
        </div>

        {isOpen && (
          <div className="flex justify-between items-center w-full">
            <span>{item.name}</span>
            {hasSubMenu && (
              // 3. Animasikan rotasi ikon chevron
              <motion.span
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <BiChevronDown className="w-5 h-5 ml-auto" />
              </motion.span>
            )}
          </div>
        )}
      </button>

      {/* 4. Gunakan AnimatePresence untuk animasi submenu */}
      <AnimatePresence>
        {hasSubMenu && isDropdownOpen && (
          <motion.ul
            key={item.name}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={clsx('mt-2 space-y-2 overflow-hidden', {
              'pl-6': isOpen,
              'pl-2': !isOpen,
            })}
          >
            {item.subMenu?.map((subItem) => (
              <SubMenuItem
                key={subItem.name}
                subItem={subItem}
                pathname={pathname}
                isOpen={isOpen}
                navigate={navigate}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}
