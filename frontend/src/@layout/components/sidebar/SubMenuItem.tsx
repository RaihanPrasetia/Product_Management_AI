// components/SubMenuItem.tsx
import { SubMenuItemType } from '@/types/MenuTypes';
import { NavigateFunction } from 'react-router-dom';

// 1. Impor library yang dibutuhkan
import { motion } from 'framer-motion';
import clsx from 'clsx';

type SubMenuItemProps = {
  subItem: SubMenuItemType;
  pathname: string;
  isOpen: boolean;
  navigate: NavigateFunction;
};

// 2. Definisikan varian animasi untuk setiap item
const subMenuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function SubMenuItem({
  subItem,
  pathname,
  isOpen,
  navigate,
}: SubMenuItemProps) {
  const isSubActive = pathname === subItem.href;

  return (
    // 3. Gunakan motion.li dan terapkan varian animasi
    <motion.li variants={subMenuItemVariants}>
      <button
        onClick={() => navigate(subItem.href)}
        // 4. Gunakan clsx untuk merapikan class names
        className={clsx(
          'flex items-center  w-full px-3 py-2 space-x-2 rounded-md text-sm font-medium transition-colors duration-200',
          {
            'bg-pink-100 text-pink-600': isSubActive,
            'hover:bg-gray-50 hover:cursor-pointer text-gray-600': !isSubActive,
          }
        )}
      >
        <div
          className={clsx('p-1 rounded-full transition-all duration-300', {
            'bg-gradient-to-br from-pink-500 to-purple-700 text-white shadow':
              isSubActive,
            'bg-gray-200 text-gray-500': !isSubActive,
          })}
        >
          <subItem.icon className="w-4 h-4" />
        </div>
        {isOpen && <span>{subItem.name}</span>}
      </button>
    </motion.li>
  );
}
