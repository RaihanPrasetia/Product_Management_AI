import React, { useMemo } from 'react';
import { Pagination } from '@/types/apiTypes';
import { FilterKeys } from '@/stores/pagination.slice';

const range = (from: number, to: number, step = 1) => {
  let i = from;
  const range = [];
  while (i <= to) {
    range.push(i);
    i += step;
  }
  return range;
};

interface PaginationProp {
  pagination: Pagination;
  setFilter: (key: FilterKeys, value: string | number) => void;
}
// -> 2. Hapus props, karena komponen akan mengambil data dari store
const CustomePagination = ({ pagination, setFilter }: PaginationProp) => {
  // -> 3. Ambil state dan aksi yang relevan dari store
  const { currentPage, totalPages } = pagination;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setFilter('page', page);
    }
  };

  // -> 4. Logika baru yang lebih robust untuk menampilkan nomor halaman
  const pageNumbers = useMemo(() => {
    // Logika useMemo sekarang dapat memanggil 'range' tanpa error
    const pageNeighbours = 1;
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
      let pages: (string | number)[] = range(startPage, endPage); // <-- Sekarang valid

      const hasLeftSpill = startPage > 2;
      const hasRightSpill = totalPages - endPage > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = ['...', ...extraPages, ...pages];
          break;
        }
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, '...'];
          break;
        }
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = ['...', ...pages, '...'];
          break;
        }
      }
      return [1, ...pages, totalPages];
    }
    return range(1, totalPages); // <-- Sekarang valid
  }, [currentPage, totalPages]);

  if (totalPages <= 1) {
    return null; // Jangan tampilkan pagination jika hanya ada 1 halaman atau kurang
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-xs font-semibold text-white bg-gray-600 rounded-lg shadow-md transition transform disabled:bg-white disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'string' ? (
            <span className="px-4 py-2 text-xs font-semibold text-gray-500">
              ...
            </span>
          ) : (
            <button
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition transform hover:brightness-110 ${
                currentPage === page
                  ? 'bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-500 hover:bg-gray-300 border border-gray-200'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-xs font-semibold text-white bg-gray-600 rounded-lg shadow-md transition transform disabled:bg-white disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default CustomePagination;
