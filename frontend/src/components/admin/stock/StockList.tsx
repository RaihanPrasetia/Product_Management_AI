import { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { FaSpinner } from 'react-icons/fa';
import Pagination from '../../ui/Pagination';
import CustomeFilter from '../../ui/CustomeFilter';
import { Stock } from '@/utils/types/StockType';
import formattedDate from '@/utils/formattedDate';

type StockListProps = {
  stocks: Stock[];
  loading: boolean;
  // Tambahkan prop untuk aksi di masa depan, misal: onAdjustStock
};

export const StockList = ({ stocks, loading }: StockListProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  // Helper untuk mendapatkan nama dan SKU yang akan ditampilkan
  const getItemDetails = (stock: Stock) => {
    if (stock.product) {
      // Untuk produk SIMPLE
      return {
        name: stock.product.name,
        sku: stock.product.sku,
      };
    }
    if (stock.productVariant) {
      // Untuk produk VARIABLE
      return {
        name: `${stock.productVariant.product.name} (${stock.productVariant.value})`,
        sku: stock.productVariant.sku,
      };
    }
    return { name: 'N/A', sku: 'N/A' }; // Fallback
  };

  // Logika filter yang sudah diperbaiki
  const filteredStocks = useMemo(() => {
    if (!searchTerm) return stocks;
    return stocks.filter((stock) => {
      const details = getItemDetails(stock);
      return (
        details.name.toLowerCase().includes(searchTerm) ||
        details.sku.toLowerCase().includes(searchTerm)
      );
    });
  }, [stocks, searchTerm]);

  const totalPages = Math.ceil(filteredStocks.length / rowsPerPage);

  const paginatedStocks = filteredStocks.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <Box className="w-full h-[200px] flex flex-col justify-center items-center gap-4">
        <FaSpinner className="animate-spin text-primary text-3xl" />
        <p className="text-gray-600 text-lg">Loading...</p>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <CustomeFilter
        pagination={rowsPerPage}
        setPagination={(value) => {
          setRowsPerPage(value);
          setCurrentPage(1);
        }}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      <TableContainer>
        <Table aria-label="stock table">
          {/* Header Tabel yang Diperbaiki */}
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '5%' }}>No</TableCell>
              <TableCell sx={{ width: '40%' }}>Nama Item</TableCell>
              <TableCell sx={{ width: '20%' }}>SKU</TableCell>
              <TableCell sx={{ width: '15%' }} align="right">
                Kuantitas
              </TableCell>
              <TableCell sx={{ width: '20%' }}>Update Terakhir</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStocks.map((stock, index) => {
              const itemDetails = getItemDetails(stock);
              return (
                <TableRow key={stock.id} hover>
                  <TableCell>
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {itemDetails.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {itemDetails.sku}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold">
                      {stock.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>{formattedDate(stock.updatedAt)}</TableCell>
                </TableRow>
              );
            })}
            {filteredStocks.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Data stok tidak ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="w-full flex justify-end items-center py-4 gap-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>
    </Box>
  );
};
