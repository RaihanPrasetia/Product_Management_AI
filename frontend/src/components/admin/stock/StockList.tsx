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
import Pagination from '../../ui/CustomePagination';
import CustomeFilter from '../../ui/CustomeFilter';
import { Stock } from '@/types/StockType';
import { formattedDate } from '@/utils/formattedDate';
import { useStockStore } from '@/stores/stock.store';
import { SortableHeaderCell } from '@/components/ui/SortableHeaderCell';

type StockListProps = {
  stocks: Stock[];
  loading: boolean;
};

export const StockList = ({ stocks, loading }: StockListProps) => {
  const { pagination, filters, setFilter, setSort } = useStockStore();

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
      <CustomeFilter filters={filters} setFilter={setFilter} />
      <TableContainer>
        <Table aria-label="stock table">
          {/* Header Tabel yang Diperbaiki */}
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '5%' }}>No</TableCell>
              <SortableHeaderCell
                sortKey="product.name" // Key untuk sorting relasi
                orderBy={filters.orderBy}
                orderDirection={filters.orderDirection}
                onSort={setSort}
              >
                Nama Item
              </SortableHeaderCell>
              <TableCell sx={{ width: '20%' }}>SKU</TableCell>{' '}
              {/* Sorting SKU lebih kompleks karena bisa dari 2 sumber */}
              <SortableHeaderCell
                sortKey="quantity" // Key untuk sorting field langsung
                orderBy={filters.orderBy}
                orderDirection={filters.orderDirection}
                onSort={setSort}
              >
                <Typography align="right">Kuantitas</Typography>
              </SortableHeaderCell>
              <SortableHeaderCell
                sortKey="updatedAt" // Key untuk sorting field langsung
                orderBy={filters.orderBy}
                orderDirection={filters.orderDirection}
                onSort={setSort}
              >
                Update Terakhir
              </SortableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.map((stock, index) => {
              const itemDetails = getItemDetails(stock);
              return (
                <TableRow key={stock.id} hover>
                  <TableCell>
                    {(pagination.currentPage - 1) * pagination.limit +
                      index +
                      1}
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
            {stocks.length === 0 && (
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
        <Pagination pagination={pagination} setFilter={setFilter} />
      </Box>
    </Box>
  );
};
