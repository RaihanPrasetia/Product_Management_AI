// MainSidebar.tsx - Main component file
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BiX } from 'react-icons/bi';
import SidebarLogo from '../ui/admin/SidebarLogo';
import SidebarNavigation from '../ui/admin/SidebarNavigation';
import { MenuItemType } from '@/utils/types/MenuTypes';
import { getMenuItems } from '@/utils/data/MenuItem';

export type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);

  // Load menu items based on user role when component mounts
  useEffect(() => {
    const items = getMenuItems();
    setMenuItems(items);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <div className="bg-white relative lg:block sm:hidden shadow-lg  text-gray-700 border border-gray-200  rounded-r-xl h-full flex flex-col transition-all duration-300">
      {/* Close Button Mobile */}
      <div className="lg:hidden flex justify-end p-2 absolute top-1 right-1">
        <button onClick={toggleSidebar} className="text-gray-700">
          <BiX className="w-6 h-6" />
        </button>
      </div>

      {/* Logo Component */}
      <SidebarLogo isOpen={isOpen} />

      <hr className="bg-gray-300" />

      {/* Navigation Component */}
      <div
        className={`overflow-hidden max-h-[450px] shadow-inner py-2 ${
          isOpen ? 'overflow-y-scroll' : 'overflow-y-hidden'
        }`}
      >
        <SidebarNavigation
          menuItems={menuItems}
          pathname={pathname}
          isOpen={isOpen}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
        />
      </div>
    </div>
  );
}
