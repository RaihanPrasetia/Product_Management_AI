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
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmationDialog } from '../../ui/ConfirmationDialog';
import { FaSpinner } from 'react-icons/fa';
import Pagination from '../../ui/Pagination';
import CustomeFilter from '../../ui/CustomeFilter';
import { Supplier } from '@/utils/types/SupplierType';
import formattedDate from '@/utils/formattedDate'; // <-- Nama import diperbaiki

type SupplierListProps = {
  suppliers: Supplier[];
  loading: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
};

export const SupplierList = ({
  suppliers,
  loading,
  onEdit,
  onDelete,
}: SupplierListProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(
    null
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (supplierToDelete) {
      onDelete(supplierToDelete.id);
      setDeleteDialogOpen(false);
      setSupplierToDelete(null);
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuppliers.length / rowsPerPage);

  const paginatedSuppliers = filteredSuppliers.slice(
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
    <>
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
          <Table aria-label="supplier table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '5%' }}>No</TableCell>
                <TableCell sx={{ width: '25%' }}>Supplier</TableCell>
                <TableCell sx={{ width: '30%' }}>Info Kontak</TableCell>
                <TableCell sx={{ width: '20%' }}>Update Terakhir</TableCell>
                <TableCell sx={{ width: '20%' }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSuppliers.map((supplier, index) => (
                <TableRow
                  key={supplier.id}
                  hover
                  sx={{
                    backgroundColor: supplier.deletedAt ? '#f7f7f7' : 'inherit',
                    '& .MuiTableCell-root': {
                      color: supplier.deletedAt ? '#999' : 'inherit',
                      textDecoration: supplier.deletedAt
                        ? 'line-through'
                        : 'none',
                    },
                  }}
                >
                  <TableCell>
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {supplier.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {supplier.phone || '-'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {supplier.address || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>{formattedDate(supplier.updatedAt)}</TableCell>
                  <TableCell align="right">
                    <>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(supplier)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(supplier)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSuppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No suppliers found
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

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Supplier"
        content={`Are you sure you want to delete "${supplierToDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};
