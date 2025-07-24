// components/ProfileDropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import profileImg from '/img/profile.png';

type ProfileDropdownProps = {
  logout: () => void;
};

export default function ProfileDropdown({ logout }: ProfileDropdownProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    logout();
    navigate('/admin/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={profileRef} className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden"
      >
        <img
          src={profileImg}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </button>
      {isDropdownOpen && (
        <div className="absolute z-50 right-0 p-4 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-100">
          <ul className="text-sm text-gray-600">
            <li
              onClick={() => navigate('/profile')}
              className="flex items-center rounded-md p-3 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={profileImg}
                alt="User Avatar"
                className="w-5 h-5 object-cover mr-2"
              />
              <span>My Profile</span>
            </li>
            <hr className="flex bg-slate-600 my-2" />
            <li
              onClick={handleLogout}
              className="flex items-center bg-gradient-to-r from-rose-500 via-rose-500 to-red-600 text-white rounded-md p-3 hover:brightness-110 cursor-pointer"
            >
              <FaArrowRightFromBracket className="h-5 w-5 mr-2" />
              <span>Logout</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
