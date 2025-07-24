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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmationDialog } from '../../ui/ConfirmationDialog';
import { FaSpinner } from 'react-icons/fa';
import Pagination from '../../ui/Pagination';
import CustomeFilter from '../../ui/CustomeFilter';
import { formatToRupiah } from '@/utils/priceFormated';
import { useNavigate } from 'react-router-dom';
import { Product, ProductFilter } from '@/utils/types/ProductType';
import { useProductTable } from '@/hooks/useProductTable'; // <-- Impor custom hook
import fromattedDate from '@/utils/formattedDate';
import { Restore } from '@mui/icons-material';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  filter: ProductFilter; // <-- Terima nilai filter saat ini
  setFilter: (value: ProductFilter) => void;
}

export const ProductList = ({
  products,
  loading,
  onEdit,
  onDelete,
  onRestore,
  filter,
  setFilter,
}: ProductListProps) => {
  const navigate = useNavigate();
  const {
    currentPage,
    rowsPerPage,
    searchTerm,
    deleteDialogOpen,
    productToDelete,
    totalPages,
    paginatedProducts,
    handleSearchChange,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handlePageChange,
    handleRowsPerPageChange,
  } = useProductTable(products, onDelete);

  const handleToDetail = (id: string) => {
    navigate(`/product/detail?productId=${id}`);
  };

  if (loading) {
    return (
      <Box className="w-full h-[200px] flex flex-col justify-center items-center gap-4">
        <FaSpinner className="animate-spin text-purple-600 text-3xl" />
        <p className="text-utama text-lg">Loading...</p>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <CustomeFilter
          pagination={rowsPerPage}
          setPagination={handleRowsPerPageChange}
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
        />
        <div className="flex justify-end items-center my-5">
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Filter Status</InputLabel>
            <Select
              value={filter}
              label="Filter Status"
              onChange={(e) => setFilter(e.target.value as ProductFilter)}
            >
              <MenuItem value="active">Produk Aktif</MenuItem>
              <MenuItem value="all">Semua Produk</MenuItem>
            </Select>
          </FormControl>
        </div>

        <TableContainer>
          <Table aria-label="product table">
            <TableHead>
              <TableRow>
                <TableCell className="w-[20px]">No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tanggal Dihapus</TableCell>
                <TableCell>
                  <Typography className="text-right">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product, index) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-utama-hover hover:cursor-pointer"
                      onClick={() => handleToDetail(product.id)}
                    >
                      {product.name}
                    </span>
                  </TableCell>
                  <TableCell width={'100px'}>
                    <Chip
                      label={product.type}
                      size="small"
                      sx={{
                        backgroundColor:
                          product.type === 'SIMPLE' ? '#34d4c1' : '#f59e0b',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatToRupiah(Number(product.price))}</TableCell>
                  <TableCell>{product.totalStock}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>
                    {product.deletedAt ? fromattedDate(product.deletedAt) : '-'}
                  </TableCell>
                  <TableCell align="right">
                    {product.deletedAt ? (
                      <Tooltip title="Restore">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => onRestore(product.id)}
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
                            onClick={() => onEdit(product)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {paginatedProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No products found
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
        title="Delete Product"
        content={`Are you sure you want to delete "${productToDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};
