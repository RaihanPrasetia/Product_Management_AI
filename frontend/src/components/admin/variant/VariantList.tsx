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
import { Variant } from '@/types/VariantType';
import {formattedDate} from '@/utils/formattedDate'; // <-- Nama import diperbaiki
import { useVariantStore } from '@/stores/variant.store';
import { useNotification } from '@/hooks/useNotification';
import { SortableHeaderCell } from '@/components/ui/SortableHeaderCell';
import { Restore } from '@mui/icons-material';

type VariantListProps = {
  variants: Variant[];
  loading: boolean;
  onEdit: (variant: Variant) => void;
};

export const VariantList = ({
  variants,
  loading,
  onEdit,
}: VariantListProps) => {
  const { deleteData, pagination, filters, setFilter, setSort, restoreData } =
    useVariantStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState<Variant | null>(null);
  const { showNotification } = useNotification();

  const handleDeleteClick = (variant: Variant) => {
    setVariantToDelete(variant);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (variantToDelete) {
      deleteData(variantToDelete.id, showNotification);
      setDeleteDialogOpen(false);
      setVariantToDelete(null);
    }
  };

  const handleRestore = (id: string) => {
    restoreData(id, showNotification);
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
        <CustomeFilter filters={filters} setFilter={setFilter} />
        <TableContainer>
          <Table aria-label="variant table">
            <TableHead>
              <TableRow>
                <TableCell className="w-[20px]">No</TableCell>
                <SortableHeaderCell
                  sortKey="name"
                  orderBy={filters.orderBy}
                  orderDirection={filters.orderDirection}
                  onSort={setSort}
                >
                  Variant
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
              {variants.map((variant, index) => (
                <TableRow
                  key={variant.id}
                  hover
                  // Beri style berbeda untuk data yang sudah dihapus
                  sx={{
                    backgroundColor: variant.deletedAt ? '#f7f7f7' : 'inherit',
                    '& .MuiTableCell-root': {
                      color: variant.deletedAt ? '#999' : 'inherit',
                      textDecoration: variant.deletedAt
                        ? 'line-through'
                        : 'none',
                    },
                  }}
                >
                  <TableCell>
                    {(pagination.currentPage - 1) * pagination.limit +
                      index +
                      1}
                  </TableCell>
                  <TableCell>{variant.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={variant.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        backgroundColor: variant.isActive
                          ? '#34d4c1'
                          : '#9ca3af',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                      }}
                    />
                  </TableCell>
                  <TableCell>{formattedDate(variant.createdAt)}</TableCell>
                  <TableCell>{formattedDate(variant.updatedAt)}</TableCell>
                  <TableCell>
                    {/* Perbaikan tampilan deletedAt */}
                    {variant.deletedAt ? formattedDate(variant.deletedAt) : '-'}
                  </TableCell>
                  <TableCell align="right">
                    {variant.deletedAt ? (
                      <Tooltip title="Restore">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleRestore(variant.id)}
                        >
                          <Restore />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(variant)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(variant)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {variants.length === 0 && (
                <TableRow>
                  {/* Perbaikan colSpan */}
                  <TableCell colSpan={7} align="center">
                    No variants found
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
        title="Delete Variant"
        content={`Are you sure you want to delete "${variantToDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};
