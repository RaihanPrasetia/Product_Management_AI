import FooterAdmin from '@/components/admin/FooterAdmin';
import Navbar from '@/components/admin/NavbarAdmin';
import Sidebar from '@/components/admin/SidebarAdmin';
import ChatModal from '@/components/ChatModal';
import { Fab, Tooltip } from '@mui/material';
import { useState } from 'react';
import { IoChatbubbles } from 'react-icons/io5';
import { Outlet, useLocation } from 'react-router-dom'; // <--- import useLocation

export default function AdminLayout() {
  const location = useLocation(); // <--- akses path sekarang
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarFixed, setSidebarFixed] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
    setSidebarFixed(!isSidebarFixed);
  };

  const handleChatOpen = () => setOpenChat(true);
  const handleChatClose = () => setOpenChat(false);

  const isLoginPage = location.pathname === '/admin/login'; // <--- cek apakah lagi di login

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      {!isLoginPage && (
        <div
          className={`h-full lg:block fixed z-50 mt-3 lg:top-0 transition-all duration-500 ease-in-out ${
            isSidebarOpen ? 'w-64' : 'w-0 lg:w-20'
          }`}
          onMouseEnter={() => {
            if (!isSidebarFixed) setSidebarOpen(true);
          }}
          onMouseLeave={() => {
            if (!isSidebarFixed) setSidebarOpen(false);
          }}
        >
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />
        </div>
      )}

      <div
        className={`transition-all w-full duration-500 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        {/* Navbar */}
        {!isLoginPage && (
          <Navbar
            toggleSidebar={handleSidebarToggle}
            isSidebar={isSidebarOpen}
          />
        )}
        <div
          className={`pb-5 ${
            isSidebarOpen ? 'px-4 lg:px-6' : 'px-4 lg:px-20'
          } `}
        >
          <Outlet />
        </div>
        {/* Footer */}
        {!isLoginPage && <FooterAdmin />}
      </div>
      {!isLoginPage && (
        <>
          <Tooltip title="AI Assistant">
            <Fab
              color="primary"
              aria-label="chat"
              onClick={handleChatOpen}
              sx={{
                position: 'fixed',
                bottom: 24, // 24px dari bawah
                right: 24, // 24px dari kanan
                zIndex: 1000, // Pastikan di atas elemen lain
              }}
            >
              <IoChatbubbles size={24} />
            </Fab>
          </Tooltip>

          {/* Render Komponen Modal */}
          <ChatModal open={openChat} handleClose={handleChatClose} />
        </>
      )}
    </div>
  );
}
