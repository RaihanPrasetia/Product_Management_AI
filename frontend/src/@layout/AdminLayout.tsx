import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Fab, Tooltip, useMediaQuery, Theme } from '@mui/material';
import { IoChatbubbles } from 'react-icons/io5';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import clsx from 'clsx';

import Sidebar from './components/sidebar/SidebarAdmin';
import Navbar from './components/navbar/NavbarAdmin';
import FooterAdmin from './components/FooterAdmin';
import ChatModal from '@/components/ChatModal';

export default function AdminLayout() {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarFixed, setSidebarFixed] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  // Hook untuk mendeteksi layar besar (desktop)
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const handleSidebarToggle = () => {
    const newState = !isSidebarOpen;
    setSidebarOpen(newState);
    setSidebarFixed(newState); // Pin sidebar saat di-toggle manual
  };

  const handleChatOpen = () => setOpenChat(true);
  const handleChatClose = () => setOpenChat(false);

  const isLoginPage = location.pathname === '/admin/login';

  const sidebarWidth = isSidebarOpen ? 256 : 80; // dalam pixel (w-64: 256px, w-20: 80px)

  const transitionProps: Transition = {
    duration: 0.4,
    ease: 'easeInOut',
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <AnimatePresence>
        {!isLoginPage && (
          <motion.div
            // Animasikan lebar sidebar
            animate={{
              width: isDesktop ? sidebarWidth : isSidebarOpen ? 256 : 0,
            }}
            transition={transitionProps}
            className="h-full lg:block fixed z-50 mt-3 lg:top-0"
            onMouseEnter={() => {
              if (!isSidebarFixed && isDesktop) setSidebarOpen(true);
            }}
            onMouseLeave={() => {
              if (!isSidebarFixed && isDesktop) setSidebarOpen(false);
            }}
          >
            <Sidebar
              isOpen={isSidebarOpen}
              toggleSidebar={handleSidebarToggle}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        // Animasikan margin konten utama hanya di desktop
        animate={{ marginLeft: isDesktop && !isLoginPage ? sidebarWidth : 0 }}
        transition={transitionProps}
        className="w-full"
      >
        {!isLoginPage && (
          <Navbar
            toggleSidebar={handleSidebarToggle}
            isSidebar={isSidebarOpen}
          />
        )}
        <div
          // Gunakan clsx untuk padding yang dinamis
          className={clsx('pb-5', {
            'px-4 lg:px-6': !isLoginPage,
            'p-0': isLoginPage,
          })}
        >
          <Outlet />
        </div>
        {!isLoginPage && <FooterAdmin />}
      </motion.div>

      <AnimatePresence>
        {!isLoginPage && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 50 }}
            transition={{ ...transitionProps, delay: 0.5 }}
          >
            <Tooltip title="AI Assistant">
              <Fab
                color="primary"
                aria-label="chat"
                onClick={handleChatOpen}
                sx={{
                  position: 'fixed',
                  bottom: 24,
                  right: 24,
                  zIndex: 1000,
                }}
              >
                <IoChatbubbles size={24} />
              </Fab>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatModal open={openChat} handleClose={handleChatClose} />
    </div>
  );
}
