// MainNavbar.tsx - Main component file
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa6';
import { FaBarsStaggered } from 'react-icons/fa6';
import { useAuth } from '@/hooks/useAuth';
import BreadcrumbNav from '../ui/admin/BreadcrumbNav';
// import CartButton from "../ui/admin/CartButton";
// import NotificationButton from "../ui/admin/NotificationButton";
import ProfileDropdown from '../ui/admin/ProfileDropdown';

type NavbarProps = {
  toggleSidebar: () => void;
  isSidebar: boolean;
};

export default function Navbar({ toggleSidebar, isSidebar }: NavbarProps) {
  const { logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-3 w-full transition-all duration-300 
                }`}
    >
      <nav
        className={`flex items-center justify-between lg:py-6 p-4 mx-0 lg:mx-4 transition-all duration-300 ${
          isScrolled
            ? `bg-white shadow-md rounded-md ${
                isSidebar ? 'mx-0 lg:mx-6' : 'mx-0 lg:mx-20'
              }`
            : 'bg-transparent text-white'
        }`}
      >
        <div className="flex items-center space-x-6">
          <button
            onClick={handleToggleSidebar}
            className={`p-2 transition rounded-full ${
              isSidebar
                ? 'bg-gradient-to-br from-pink-500 to-purple-700 border-2 border-gray-100 shadow-mui-customShadow text-white'
                : 'text-slate-600 hover:bg-white hover:shadow-mui-customShadow hover:text-gray-900'
            }`}
          >
            {isSidebar ? <FaBarsStaggered size={24} /> : <FaBars size={24} />}
          </button>

          <BreadcrumbNav pathname={location.pathname} />
        </div>

        <div className="flex items-center space-x-6 relative">
          {/* <CartButton count={5} />
                    <NotificationButton /> */}
          <ProfileDropdown logout={logout} />
        </div>
      </nav>
    </div>
  );
}
