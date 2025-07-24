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
import Pagination from '../../ui/Pagination';
import CustomeFilter from '../../ui/CustomeFilter';
import { Brand } from '@/utils/types/BrandType';
import formattedDate from '@/utils/formattedDate'; // <-- Nama import diperbaiki

type BrandListProps = {
  brands: Brand[];
  loading: boolean;
  onEdit: (brand: Brand) => void;
  onDelete: (id: string) => void;
};

export const BrandList = ({
  brands,
  loading,
  onEdit,
  onDelete,
}: BrandListProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (brand: Brand) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (brandToDelete) {
      onDelete(brandToDelete.id);
      setDeleteDialogOpen(false);
      setBrandToDelete(null);
    }
  };

  const filteredCategories = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);

  const paginatedCategories = filteredCategories.slice(
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
          <Table aria-label="brand table">
            <TableHead>
              <TableRow>
                <TableCell className="w-[20px]">No</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Deleted At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCategories.map((brand, index) => (
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
                    {/* Perbaikan penomoran paginasi */}
                    {(currentPage - 1) * rowsPerPage + index + 1}
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
                    {/* Perbaikan tampilan deletedAt */}
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
              {filteredCategories.length === 0 && (
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
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
