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
  Chip,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmationDialog } from '../../ui/ConfirmationDialog';
import { FaSpinner } from 'react-icons/fa';
import Pagination from '../../ui/CustomePagination';
import CustomeFilter from '../../ui/CustomeFilter';
import { Brand } from '@/types/BrandType';
import formattedDate from '@/utils/formattedDate'; // <-- Nama import diperbaiki
import { useBrandStore } from '@/stores/brand.store';
import { useNotification } from '@/hooks/useNotification';
import { SortableHeaderCell } from '@/components/ui/SortableHeaderCell';

type BrandListProps = {
  brands: Brand[];
  loading: boolean;
  onEdit: (brand: Brand) => void;
};

export const BrandList = ({ brands, loading, onEdit }: BrandListProps) => {
  const { deleteData, pagination, filters, setFilter, setSort } =
    useBrandStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  // use Hook
  const { showNotification } = useNotification();

  const handleDeleteClick = (brand: Brand) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (brandToDelete) {
      deleteData(brandToDelete.id, showNotification);
      setDeleteDialogOpen(false);
      setBrandToDelete(null);
    }
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
          <Table aria-label="brand table">
            <TableHead>
              <TableRow>
                <TableCell className="w-[20px]">No</TableCell>
                <SortableHeaderCell
                  sortKey="name"
                  orderBy={filters.orderBy}
                  orderDirection={filters.orderDirection}
                  onSort={setSort}
                >
                  Brand
                </SortableHeaderCell>
                <SortableHeaderCell
                  sortKey="isActive"
                  orderBy={filters.orderBy}
                  orderDirection={filters.orderDirection}
                  onSort={setSort}
                >
                  Status
                </SortableHeaderCell>
                <SortableHeaderCell
                  sortKey="createdAt"
                  orderBy={filters.orderBy}
                  orderDirection={filters.orderDirection}
                  onSort={setSort}
                >
                  Create Date
                </SortableHeaderCell>
                <SortableHeaderCell
                  sortKey="updatedAt"
                  orderBy={filters.orderBy}
                  orderDirection={filters.orderDirection}
                  onSort={setSort}
                >
                  Last Update
                </SortableHeaderCell>
                <SortableHeaderCell
                  sortKey="deletedAt"
                  orderBy={filters.orderBy}
                  orderDirection={filters.orderDirection}
                  onSort={setSort}
                >
                  Deleted Date
                </SortableHeaderCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {brands.map((brand, index) => (
                <TableRow
                  key={brand.id}
                  hover
                  // Beri style berbeda untuk data yang sudah dihapus
                  sx={{
                    backgroundColor: brand.deletedAt ? '#f7f7f7' : 'inherit',
                    '& .MuiTableCell-root': {
                      color: brand.deletedAt ? '#999' : 'inherit',
                      textDecoration: brand.deletedAt ? 'line-through' : 'none',
                    },
                  }}
                >
                  <TableCell>
                    {(pagination.currentPage - 1) * pagination.limit +
                      index +
                      1}
                  </TableCell>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={brand.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        backgroundColor: brand.isActive ? '#34d4c1' : '#9ca3af',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                      }}
                    />
                  </TableCell>
                  <TableCell>{formattedDate(brand.createdAt)}</TableCell>
                  <TableCell>{formattedDate(brand.updatedAt)}</TableCell>
                  <TableCell>
                    {brand.deletedAt ? formattedDate(brand.deletedAt) : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(brand)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(brand)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  </TableCell>
                </TableRow>
              ))}
              {brands.length === 0 && (
                <TableRow>
                  {/* Perbaikan colSpan */}
                  <TableCell colSpan={7} align="center">
                    No brands found
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

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Brand"
        content={`Are you sure you want to delete "${brandToDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};
