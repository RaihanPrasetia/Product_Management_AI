// src/layouts/GuestLayout.tsx
import FooterGuest from '@/components/guest/FooterGuest';
import NavbarGuest from '../components/guest/NavbarGuest';
import { Outlet, useLocation } from 'react-router-dom';

export default function GuestLayout() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register', '/admin/login'];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-transparent flex flex-col m-0 p-0">
      {!shouldHideNavbar && <NavbarGuest />}

      {/* Halaman Child (Login / Home) */}
      <div className="min-h-[80vh]">
        <Outlet />
      </div>

      {!shouldHideNavbar && <FooterGuest />}
    </div>
  );
}
