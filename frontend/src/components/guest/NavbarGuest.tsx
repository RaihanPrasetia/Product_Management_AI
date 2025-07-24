import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Import useEffect
import { HiChevronDown, HiMenu, HiX } from 'react-icons/hi'; // Tambah ikon untuk mobile

export default function NavbarGuest() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // State untuk menjejak status skrol
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State untuk menu mobile

  // useEffect untuk menambah dan membuang event listener skrol
  useEffect(() => {
    const handleScroll = () => {
      // Jika posisi skrol lebih besar dari 10px, set isScrolled menjadi true
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Tambah event listener ketika komponen dipasang
    window.addEventListener('scroll', handleScroll);

    // Cleanup: Buang event listener ketika komponen dibuka untuk elak memory leak
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Array kosong memastikan efek ini hanya berjalan sekali semasa pemasangan

  const handleScrollTo = (
    e: React.MouseEvent<HTMLButtonElement>,
    target: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(target);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - (target === 'home' ? 0 : 100),
        behavior: 'smooth',
      });
    }
    // Tutup menu selepas navigasi
    setMenuOpen(false);
    setMobileMenuOpen(false);
  };

  // Gabungkan kelas-kelas Tailwind dengan lebih kemas
  const navLinkClass = `font-semibold transition-colors duration-300 ${
    isScrolled
      ? 'text-gray-700 hover:text-utama'
      : 'text-white hover:text-gray-200'
  }`;

  const mobileNavLinkClass =
    'block py-2 px-4 text-gray-700 hover:bg-utama hover:text-white rounded-md';

  return (
    // Kelas CSS diubah secara dinamik berdasarkan state 'isScrolled'
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-50 shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className={`text-xl font-bold ${navLinkClass}`}>
              E-Shop
            </Link>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              className={navLinkClass}
              onClick={(e) => handleScrollTo(e, 'home')}
            >
              Beranda
            </button>
            <button
              className={navLinkClass}
              onClick={(e) => handleScrollTo(e, 'products')}
            >
              Produk
            </button>

            {/* Dropdown Layanan */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center space-x-1 ${navLinkClass}`}
              >
                <span>Layanan</span>
                <HiChevronDown
                  className={`transition-transform duration-200 ${
                    menuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {menuOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1">
                  <button
                    onClick={(e) => handleScrollTo(e, 'benfits')}
                    className={mobileNavLinkClass}
                  >
                    Kenapa Kami
                  </button>
                  <button
                    onClick={(e) => handleScrollTo(e, 'layananKami')}
                    className={mobileNavLinkClass}
                  >
                    Layanan Kami
                  </button>
                  <button
                    onClick={(e) => handleScrollTo(e, 'tentangKami')}
                    className={mobileNavLinkClass}
                  >
                    Tentang Kami
                  </button>
                </div>
              )}
            </div>

            <button
              className={navLinkClass}
              onClick={(e) => handleScrollTo(e, 'contact')}
            >
              Kontak
            </button>
          </nav>

          {/* Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className={`px-4 py-2 text-md font-medium rounded-md transition-colors duration-300 ${
                isScrolled
                  ? 'text-utama hover:bg-orange-100'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="bg-utama text-white px-4 py-2 rounded-md text-md font-medium hover:bg-blue-700 transition"
            >
              Daftar
            </Link>
          </div>

          {/* Tombol Menu Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={navLinkClass}
            >
              {mobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-50 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={(e) => handleScrollTo(e, 'home')}
            className={mobileNavLinkClass}
          >
            Beranda
          </button>
          <button
            onClick={(e) => handleScrollTo(e, 'products')}
            className={mobileNavLinkClass}
          >
            Produk
          </button>
          <button
            onClick={(e) => handleScrollTo(e, 'benfits')}
            className={mobileNavLinkClass}
          >
            Kenapa Kami
          </button>
          <button
            onClick={(e) => handleScrollTo(e, 'layananKami')}
            className={mobileNavLinkClass}
          >
            Layanan Kami
          </button>
          <button
            onClick={(e) => handleScrollTo(e, 'tentangKami')}
            className={mobileNavLinkClass}
          >
            Tentang Kami
          </button>
          <button
            onClick={(e) => handleScrollTo(e, 'contact')}
            className={mobileNavLinkClass}
          >
            Kontak
          </button>
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <Link
              to="/login"
              className="block text-center w-full px-4 py-2 text-md font-medium text-utama bg-orange-100 rounded-md"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="block text-center w-full bg-utama text-white px-4 py-2 rounded-md text-md font-medium hover:bg-blue-700"
            >
              Daftar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
