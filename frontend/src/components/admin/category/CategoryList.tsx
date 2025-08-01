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
import { Category } from '@/types/CategoryType';
import {formattedDate} from '@/utils/formattedDate'; // <-- Nama import diperbaiki
import { useCategoryStore } from '@/stores/category.store';
import { useNotification } from '@/hooks/useNotification';
import { SortableHeaderCell } from '@/components/ui/SortableHeaderCell';

type CategoryListProps = {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
};

export const CategoryList = ({
  categories,
  loading,
  onEdit,
}: CategoryListProps) => {
  const { deleteData, pagination, filters, setSort, setFilter } =
    useCategoryStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const { showNotification } = useNotification();

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteData(categoryToDelete.id, showNotification);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
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
          <Table aria-label="category table">
            <TableHead>
              <TableRow>
                <TableCell className="w-[20px]">No</TableCell>
                <SortableHeaderCell
                  sortKey="name"
                  orderBy={filters.orderBy}
                  orderDirection={filters.orderDirection}
                  onSort={setSort}
                >
                  Category
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
              {categories.map((category, index) => (
                <TableRow
                  key={category.id}
                  hover
                  sx={{
                    backgroundColor: category.deletedAt ? '#f7f7f7' : 'inherit',
                    '& .MuiTableCell-root': {
                      color: category.deletedAt ? '#999' : 'inherit',
                      textDecoration: category.deletedAt
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
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={category.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        backgroundColor: category.isActive
                          ? '#34d4c1'
                          : '#9ca3af',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                      }}
                    />
                  </TableCell>
                  <TableCell>{formattedDate(category.createdAt)}</TableCell>
                  <TableCell>{formattedDate(category.updatedAt)}</TableCell>
                  <TableCell>
                    {/* Perbaikan tampilan deletedAt */}
                    {category.deletedAt
                      ? formattedDate(category.deletedAt)
                      : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(category)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(category)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  {/* Perbaikan colSpan */}
                  <TableCell colSpan={7} align="center">
                    No categories found
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
        title="Delete Category"
        content={`Are you sure you want to delete "${categoryToDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};
