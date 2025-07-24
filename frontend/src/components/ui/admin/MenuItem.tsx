// components/MenuItem.tsx
import { NavigateFunction } from 'react-router-dom';
import { BiChevronDown } from 'react-icons/bi';
import { MenuItemType } from '@/utils/types/MenuTypes';
import SubMenuItem from './SubMenuItem';

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
    pathname === item.href ||
    (hasSubMenu && item.subMenu?.some((subItem) => pathname === subItem.href));

  return (
    <li>
      <button
        onClick={() =>
          hasSubMenu ? toggleDropdown(item.name) : navigate(item.href)
        }
        className={`flex items-center w-full px-3 py-2 space-x-3 rounded-xl text-sm font-semibold transition-all ${
          isActive
            ? 'bg-purple-200 text-purple-700 shadow'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <div
          className={`p-2 rounded-full transition-all ${
            isActive
              ? 'text-white bg-gradient-to-br from-pink-500 to-purple-700 shadow'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          <item.icon className="w-5 h-5" />
        </div>

        {isOpen && (
          <div className="flex justify-between items-center w-full">
            <span>{item.name}</span>
            {hasSubMenu && (
              <BiChevronDown
                className={`w-5 h-5 ml-auto transition-transform ${
                  activeDropdown === item.name ? 'rotate-180' : ''
                }`}
              />
            )}
          </div>
        )}
      </button>

      {/* Submenu */}
      {hasSubMenu && activeDropdown === item.name && (
        <ul className={`mt-2 space-y-2 ${isOpen ? 'pl-6' : 'pl-2'}`}>
          {item.subMenu?.map((subItem) => (
            <SubMenuItem
              key={subItem.name}
              subItem={subItem}
              pathname={pathname}
              isOpen={isOpen}
              navigate={navigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
