import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip, // <-- Impor Chip untuk status
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmationDialog } from '../../ui/ConfirmationDialog';
import { FaSpinner } from 'react-icons/fa';
import Pagination from '../../ui/CustomePagination';
import CustomeFilter from '../../ui/CustomeFilter';
import { Sale } from '@/types/SaleType';
import { formattedDate } from '@/utils/formattedDate';
import { useSaleStore } from '@/stores/sale.store';
import { useNotification } from '@/hooks/useNotification';
import { formatCurrency } from '@/utils/formatCurrency';
import { SortableHeaderCell } from '@/components/ui/SortableHeaderCell';
import { useNavigate } from 'react-router-dom';
import { Restore } from '@mui/icons-material';

type SaleListProps = {
  sales: Sale[];
  loading: boolean;
};

export const SaleList = ({ sales, loading }: SaleListProps) => {
  const { deleteData, restoreData, pagination, filters, setFilter, setSort } =
    useSaleStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [saleToRestore, setSaleToRestore] = useState<Sale | null>(null);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleDeleteClick = (sale: Sale) => {
    setSaleToDelete(sale);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (saleToDelete) {
      deleteData(saleToDelete.id, showNotification);
      setDeleteDialogOpen(false);
      setSaleToDelete(null);
    }
  };

  const handleRestoreClick = (sale: Sale) => {
    setSaleToRestore(sale);
    setRestoreDialogOpen(true);
  };

  // 3. Tambah handler untuk konfirmasi restore
  const handleConfirmRestore = () => {
    if (saleToRestore) {
      restoreData(saleToRestore.id, showNotification);
      setRestoreDialogOpen(false);
      setSaleToRestore(null);
    }
  };

  const handleToDetail = (id: string) => {
    navigate(`/sale/detail?saleId=${id}`);
  };

  if (loading) {
    return (
      <Box className="w-full h-full flex flex-col justify-center items-center gap-4">
        <FaSpinner className="animate-spin text-primary text-3xl" />
        <p className="text-gray-600 text-lg">Loading...</p>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <CustomeFilter filters={filters} setFilter={setFilter} />
        <TableContainer>
          <Table aria-label="sale table">
            <TableHead>
              <TableRow>
                <TableCell className="w-[20px]">No</TableCell>
                <TableCell>Invoice</TableCell>
                <SortableHeaderCell
                  sortKey="saleDate"
                  orderBy={filters.orderBy}
                  orderDirection={filters.orderDirection}
                  onSort={setSort}
                >
                  Tanggal Penjualan
                </SortableHeaderCell>
                <SortableHeaderCell
                  sortKey="totalAmount"
                  orderBy={filters.orderBy}
                  orderDirection={filters.orderDirection}
                  onSort={setSort}
                >
                  Total
                </SortableHeaderCell>
                <TableCell>Status</TableCell>
                <SortableHeaderCell
                  sortKey="deletedAt"
                  orderBy={filters.orderBy}
                  orderDirection={filters.orderDirection}
                  onSort={setSort}
                >
                  Dihapus Pada
                </SortableHeaderCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale, index) => (
                <TableRow
                  key={sale.id}
                  hover
                  sx={{
                    backgroundColor: sale.deletedAt ? '#fee2e2' : 'inherit', // Warna merah muda untuk yang dihapus
                    '&:hover': {
                      backgroundColor: sale.deletedAt ? '#fecaca' : undefined,
                    },
                    '& .MuiTableCell-root': {
                      color: sale.deletedAt ? '#cd5c5c' : 'inherit',
                      textDecoration: sale.deletedAt ? 'line-through' : 'none',
                    },
                  }}
                >
                  <TableCell>
                    {(pagination.currentPage - 1) * pagination.limit +
                      index +
                      1}
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-utama-hover cursor-pointer text-blue-500"
                      onClick={() => handleToDetail(sale.id)}
                    >
                      {sale.invoiceNumber}
                    </span>
                  </TableCell>
                  <TableCell>{formattedDate(sale.saleDate)}</TableCell>
                  <TableCell>{formatCurrency(sale.totalAmount)}</TableCell>
                  <TableCell>
                    {sale.deletedAt ? (
                      <Chip label="Dihapus" color="error" size="small" />
                    ) : (
                      <Chip label="Selesai" color="success" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {sale.deletedAt ? formattedDate(sale.deletedAt) : '-'}
                  </TableCell>
                  <TableCell align="right">
                    {sale.deletedAt && (
                      <Tooltip title="Restore">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleRestoreClick(sale)}
                        >
                          <Restore />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(sale)}
                          disabled={!!sale.deletedAt} // Nonaktifkan tombol jika sudah dihapus
                        >
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {sales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No sales found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box className="w-full flex justify-end items-center py-4 gap-2">
          {/* Pagination Anda sudah benar */}
          <Pagination pagination={pagination} setFilter={setFilter} />
        </Box>
      </Box>

      {/* 4. Buat dialog konfirmasi lebih dinamis */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Konfirmasi Hapus Penjualan"
        content={`Anda yakin ingin menghapus penjualan dengan invoice "${saleToDelete?.invoiceNumber}"? Aksi ini tidak dapat dibatalkan.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmColor="error"
        confirmText="Ya, Hapus"
      />

      <ConfirmationDialog
        open={restoreDialogOpen}
        title="Konfirmasi Pemulihan Data"
        content={`Anda yakin ingin memulihkan penjualan dengan invoice "${saleToRestore?.invoiceNumber}"?`}
        onConfirm={handleConfirmRestore}
        onCancel={() => setRestoreDialogOpen(false)}
        confirmColor="warning"
        confirmText="Ya, Pulihkan"
      />
    </>
  );
};
