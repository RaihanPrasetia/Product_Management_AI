import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const delta = 1; // Menampilkan 1 halaman di sebelah kiri dan kanan halaman aktif

        // Jika halaman aktif lebih dari 3, tambahkan halaman pertama dan "..."
        if (currentPage >= 3) {
            pageNumbers.push(1);
            pageNumbers.push('...')
        }

        // Menambahkan halaman-halaman di sekitar halaman aktif
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
            if (i > 0 && i <= totalPages) {
                pageNumbers.push(i);
            }
        }

        // Jika halaman aktif kurang dari total halaman-2, tambahkan "..."
        if (currentPage < totalPages - 1) {
            pageNumbers.push("...");
        }

        // Tambahkan halaman terakhir jika tidak sudah ada
        if (currentPage < totalPages - 2) {
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

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
                    {page === "..." ? (
                        <span className="px-4 py-2 text-xs font-semibold text-gray-500">...</span>
                    ) : (
                        <button
                            onClick={() => handlePageChange(Number(page))}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition transform hover:brightness-110 
                                ${currentPage === page
                                    ? 'bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-lg'
                                    : 'bg-white text-gray-500 hover:bg-gray-300 border border-gray-200'}
                            ${currentPage === page ? 'scale-105' : ''}`}
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

export default Pagination;
